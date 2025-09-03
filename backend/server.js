import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cloudinary from "cloudinary";
import compression from "compression";
import cors from "cors";
import { sql } from "./config/db.js";

import propertyRoutes from "./routes/propertyRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import agencyRoutes from "./routes/agencyRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(compression());
app.use(cors());

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/properties", propertyRoutes);
app.use("/api/auth", loginRoutes);
app.use("/api/user", userRoutes);
app.use("/api", chatRoutes);
app.use("/api/agency", agencyRoutes);
app.use("/api/admin", adminRoutes);

async function initDB() {
  try {
    const result = await sql`SELECT 1 AS test_value`;
    console.log("Database connected successfully", result);
    return true;
  } catch (err) {
    console.log("Error initialising database", err);
    return false;
  }
}

console.log("Connecting to database");
initDB().then((success) => {
  if (success) {
    app.listen(PORT, (req, res) => {
      console.log("Server running on port:", PORT);
    });
  } else {
    console.log("Server not started due to database connection error");
    process.exit(1);
  }
});

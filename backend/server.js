import dotenv from "dotenv";
import express from "express";
import cloudinary from "cloudinary";
import cors from "cors";
import { sql } from "./config/db.js";
import compression from "compression";

dotenv.config();

import propertyRoutes from "./routes/propertyRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";
import { log } from "console";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(cors());
app.use(compression());
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/", propertyRoutes);
app.use("/api/auth/", loginRoutes);

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

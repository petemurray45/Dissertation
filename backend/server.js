// backend packages
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { sql } from "./config/db.js";

// route imports
import propertyRoutes from "./routes/propertyRoutes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
// helmet used as security middleware to protect app by setting various HTTP headers
app.use(helmet());
// morgan used to log requests
app.use(morgan("dev"));

// routes
app.use("/api/properties", propertyRoutes);

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

// backend packages
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import axios from "axios";
import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";

// route imports
import propertyRoutes from "./routes/propertyRoutes.js";
dotenv.config();

// configured multer to store files in memory
const upload = multer({ storage: multer.memoryStorage() });
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// helmet used as security middleware to protect app by setting various HTTP headers
//app.use(helmet());
// morgan used to log requests
app.use(morgan("dev"));
// images is the name attribute applied to the input type "file" on the frontend
//app.use("/api", upload.array("images", 10), propertyRoutes); // max 10 images for now

// apply rate-limiting to all routes

/** 
app.use(async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1, // each request uses 1 token
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({ error: "Too many requests" });
      } else if (decision.reason.isBot()) {
        res.status(403).json({ error: "Bot access denied" });
      } else {
        res.status(403).json({ error: "Forbidden" });
      }
      return;
    }

    // check for spoofed bots
    if (
      decision.results.some(
        (result) => result.reason.isBot() && result.reason.isSpoofed()
      )
    ) {
      res.status(403).json({ error: "Spoofed bot detected" });
      return;
    }
    next();
  } catch (err) {
    console.log("Arcjet error", err);
    next(err);
  }
});
*/

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

app.listen(PORT, (req, res) => {
  console.log("Server running on port:", PORT);
});

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

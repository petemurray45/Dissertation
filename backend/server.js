// backend packages
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
// helmet used as security middleware to protect app by setting various HTTP headers
app.use(helmet());
// morgan used to log requests
app.use(morgan("dev"));

app.get("/", (req, res) => {
  console.log(res.getHeaders());
  res.send("hello from the backend");
});

app.listen(PORT, () => {
  console.log("Server running on port:", PORT);
});

import { OpenAI } from "openai/client.js";
import { sql } from "../config/db";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

import dotenv from "dotenv";
dotenv.config();

import app, { initDB } from "./app.js";

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`[server] listening on ${PORT}`);
    });
  } catch (err) {
    console.error("[server] failed to init DB:", err);
    process.exit(1);
  }
})();

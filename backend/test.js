// test.js
import express from "express";

console.log("Express loaded");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3001, () => {
  console.log("Server listening on port 3001");
});

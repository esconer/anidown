const express = require("express");
// import { Express } from 'express';
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json);

app.get("/search", (req, res) => {
  console.log(req.query);
  res.send("Hello World!");
});
app.post("/search", (req, res) => {
  console.log(req.body);
  res.send("<h1>hola</h1>");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

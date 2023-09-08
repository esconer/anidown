const express = require("express");
const anidown = require("./down.js");
// const link= require("./down.js");
// import express from "express";
// import "./down.js";
// import { Express } from 'express';
const app = express();
const port = 3000;
// app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  console.log(req.query);

  res.send("Hello World!");
});

app.get("/search", async (req, res) => {
  console.log(req.query);

  const { ani_name, ep_no, lang } = req.query;

  const link = await anidown(ani_name, ep_no, lang);

  console.log(link);
  res.send(`<a href="${link}" target="_blank">link</a>`);
});
app.post("/search", (req, res) => {
  console.log(req.query);
  // console.log(req.body);
  // const {ani_name,ep_no,lang} = req.query
  // console.log("---------------");
  // anidown(ani_name,ep_no,lang)

  res.send("<h1>hola</h1>");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// anidown("dr. stone", 4, "dub");

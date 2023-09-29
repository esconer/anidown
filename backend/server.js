const express = require("express");
const anidown = require("./down.js");
const cors = require("cors");
require('dotenv').config()


const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
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
app.post("/search", async (req, res) => {
  // console.log(req.query);
  // console.log(req.json);

  const { ani_name, ep_no, lang } = req.body;
  const link = await anidown(ani_name, ep_no, lang);
  // anidown(ani_name,ep_no,lang)
  if (link) {
    res.send(link);
  }else{
    res.status(404).send('Resource not found');
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// anidown("dr. stone", 4, "dub");

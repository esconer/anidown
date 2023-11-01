const express = require("express");
const anidown = require("./down.js");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send({ status: "OK" });
});

app.post("/search", async (req, res) => {
  const { ani_name, ep_no, lang } = req.body;
  const link = await anidown(ani_name, ep_no, lang);

  if (link) {
    res.send(link);
  } else {
    res.status(404).send('Resource not found');
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
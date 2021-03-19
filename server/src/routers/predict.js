const express = require("express");
const getTopKSimilarImages = require("../utils/ann");
const fs = require("fs");

const imageNames = JSON.parse(fs.readFileSync("./data/imageName.json", "utf-8"));
const BASE_URL = process.env.BASE_URL;
const PORT = process.env.PORT;

const router = express.Router();

router.post("/", async (req, res) => {
  const { features } = req.body;
  const neighbors = await getTopKSimilarImages(features);
  console.log("neighbors", neighbors);
  const images = neighbors.map((item) => {
    return {
      name: `${imageNames[item]}`,
      url: `http://${BASE_URL}:${PORT}/images/${imageNames[item]}`,
    };
  });
  res.send(images);
});

module.exports = router;

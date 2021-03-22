const express = require("express");
const query = require("../db/query");

const router = express.Router();

router.get("/", async (req, res) => {
  // const { imageName } = req.query;
  const imageName = "10054.jpg";

  const cmd1 = `select label,x,y from parts join images on parts.imageId=images.Id where images.name='${imageName}'`;
  const result1 = await query(cmd1);

  const cmd2 = `select height,width,x1,y1,x2,y2 from images where name='${imageName}'`;
  const result2 = await query(cmd2);

  const result = {
    image: result2[0],
    parts: result1,
  };
  res.json(result);
});

module.exports = router;

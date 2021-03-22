const express = require('express');
const fs = require('fs');

const router = express.Router();

router.post('/', (req, res) => {
  const logContent = req.body.content;
  const logFile = JSON.parse(fs.readFileSync('./src/logs/logs.json', 'utf-8'));
  const date = new Date();
  const dateString = date.toLocaleTimeString();

  logFile[dateString] = logContent;

  fs.writeFileSync('./src/logs/logs.json', JSON.stringify(logFile, null, 2) + '\n');

  res.send('ACCEPTED!');
});

module.exports = router;

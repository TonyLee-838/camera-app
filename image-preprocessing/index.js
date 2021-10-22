const fs = require("fs");
const Jimp = require("jimp");

const INPUT_PATH = "./processed-scaled";
const OUTPUT_PATH = "./processed-224";

const IMAGE_WIDTH = 224;
const IMAGE_HEIGHT = 224;
const IMAGE_QUALITY = 80;

let count = 0;

const run = async () => {
  const files = fs.readdirSync(INPUT_PATH);

  for (let i = 0; i < files.length; i++) {
    await processImg(`${INPUT_PATH}/${files[i]}`, `${OUTPUT_PATH}/${files[i]}`);
    console.log(`进度：${++count} / ${files.length}`);
  }
};

const processImg = async (inputPath, outputPath) => {
  return new Promise(async (resolve) => {
    const img = await Jimp.read(inputPath);
    img.resize(IMAGE_WIDTH, IMAGE_HEIGHT).quality(IMAGE_QUALITY).write(outputPath);
    resolve();
  });
};

run();

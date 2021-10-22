import arrayShuffle = require("array-shuffle");
import * as tf from "@tensorflow/tfjs-node";
import * as fs from "fs";

interface LoadOptions {
  testSize?: number;
  shuffle?: boolean;
}

interface ModelObject {
  imagePath: string;
  features: number[];
}

const loadImages = (allImageFeatures: number[][], allImageNames: string[]) => {
  let data = allImageFeatures.map((features: number[], i) => ({ features, name: allImageNames[i] }));
  data = arrayShuffle(data);

  const trainingSet = {
    features: tf.tensor(data.map((obj) => obj.features)),
    imageIndexes: tf.range(0, data.length).as2D(data.length, 1),
    imagePaths: data.map((obj) => obj.name),
  };

  return trainingSet;
};

export default loadImages;

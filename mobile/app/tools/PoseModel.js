import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import { POSENET_MODEL_URL } from "../api/http";

const INPUT_WIDTH = 750;
const INPUT_HEIGHT = 1500;
export default class PoseModel {
  constructor(modelUrl) {
    // this.modelUrl = modelUrl;
    this.init();
  }
  async init() {
    await tf.ready();
    await tf.getBackend();
    this.model = await posenet.load({
      modelUrl: POSENET_MODEL_URL,
      architecture: "ResNet50",
      outputStride: 32,
      // inputResolution: { width: 640, height: 480 },
      inputResolution: 500,
      quantBytes: 1,
      multiplier: 1,
    });
    console.warn("load PoseModel success");
  }
  async analysePose(imageTensor) {
    const result = await this.model.estimateSinglePose(imageTensor, { flipHorizontal: true });

    return {
      keypoints: result.keypoints,
      width: INPUT_WIDTH,
      height: INPUT_HEIGHT,
    };
  }
}

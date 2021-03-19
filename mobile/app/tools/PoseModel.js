import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import { POSENET_MODEL_URL} from '../api/http'

const INPUT_WIDTH = 250;
const INPUT_HEIGHT = 500;
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
      architecture: "MobileNetV1",
      outputStride: 8,
      inputResolution: { width: 640, height: 480 },
      multiplier: 1,
    });
    console.warn("load PoseModel success");
  }
  async analysePose(imageTensor) {
    const { keypoints } = await this.model.estimateSinglePose(imageTensor);
    return {
      keypoints,
      width: INPUT_WIDTH,
      height: INPUT_HEIGHT,
    };
  }
}

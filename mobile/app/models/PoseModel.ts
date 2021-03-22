import * as tf from '@tensorflow/tfjs';
import * as posenet from './posenet';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

import { POSENET_MODEL_URL } from '../api/http';

const INPUT_WIDTH = 750;
const INPUT_HEIGHT = 1500;
export class PoseModel {
  private model;
  constructor() {
    // this.modelUrl = modelUrl;
    this.init();
  }
  async init() {
    await tf.ready();
    await tf.getBackend();

    const modelJSON = require('../assets/model/pose/model.json');
    const w1 = require('../assets/model/pose/group1-shard1of6.bin');
    const w2 = require('../assets/model/pose/group1-shard2of6.bin');
    const w3 = require('../assets/model/pose/group1-shard3of6.bin');
    const w4 = require('../assets/model/pose/group1-shard4of6.bin');
    const w5 = require('../assets/model/pose/group1-shard5of6.bin');
    const w6 = require('../assets/model/pose/group1-shard6of6.bin');

    const handler = bundleResourceIO(modelJSON, [w1, w2, w3, w4, w5, w6]);

    this.model = await posenet.load(handler, {
      // modelUrl: POSENET_MODEL_URL,
      architecture: 'ResNet50',
      outputStride: 32,
      inputResolution: 500,
      quantBytes: 1,
      multiplier: 1,
    });
    console.log('Pose Model Loaded!');
  }
  async analysePose(imageTensor) {
    const result = await this.model.estimateSinglePose(imageTensor);

    return {
      keypoints: result.keypoints,
      width: INPUT_WIDTH,
      height: INPUT_HEIGHT,
    };
  }
}

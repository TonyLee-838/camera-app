import * as tf from '@tensorflow/tfjs';
import * as posenet from './posenet';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

import { POSENET_MODEL_URL } from '../api/http';
import { callbacks } from '@tensorflow/tfjs';

export class PoseModel {
  private model: posenet.PoseNet;
  private INPUT_WIDTH = 750;
  private INPUT_HEIGHT = 1500;

  constructor() {}
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
      architecture: 'ResNet50',
      outputStride: 32,
      inputResolution: 500,
      quantBytes: 1,
      multiplier: 1,
    });
  }
  async analysePose(imageTensor: tf.Tensor) {
    const result = await this.model.estimateSinglePose(imageTensor);

    return {
      keypoints: result.keypoints,
      dimensions: {
        width: this.INPUT_WIDTH,
        height: this.INPUT_HEIGHT,
      },
    };
  }
}

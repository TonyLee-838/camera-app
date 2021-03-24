import * as coco from './coco-ssd';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import { findPersonBox } from '../helpers/boxTools';

export class CocoModel {
  private model: coco.ObjectDetection;
  private INPUT_WIDTH = 750;
  private INPUT_HEIGHT = 1500;

  constructor() {
    // this.init();
  }
  async init() {
    await tf.ready();
    await tf.getBackend();

    const modelJSON = require('../assets/model/coco-ssd/model.json');
    const w1 = require('../assets/model/coco-ssd/group1-shard1of5.bin');
    const w2 = require('../assets/model/coco-ssd/group1-shard2of5.bin');
    const w3 = require('../assets/model/coco-ssd/group1-shard3of5.bin');
    const w4 = require('../assets/model/coco-ssd/group1-shard4of5.bin');
    const w5 = require('../assets/model/coco-ssd/group1-shard5of5.bin');

    const handler = bundleResourceIO(modelJSON, [w1, w2, w3, w4, w5]);

    this.model = await coco.load(handler, {
      base: 'lite_mobilenet_v2',
    });
  }

  async getBoundingBox(imageTensor: tf.Tensor3D) {
    if (!this.model) return;

    const detected = await this.model.detect(imageTensor, 1, 0.6);

    const personBox = findPersonBox(detected);

    return {
      position: personBox,
      dimensions: {
        width: this.INPUT_WIDTH,
        height: this.INPUT_HEIGHT,
      },
    };
  }
}

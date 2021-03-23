import * as coco from './coco-ssd';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

import { COCO_MODEL_URL } from '../api/http';

export class CocoModel {
  private model;

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
      // modelUrl: COCO_MODEL_URL,
    });

    // console.log('Coco Model Loaded!');
    // return new Promise<void>((resolve) => resolve());
  }

  getBoundingBox(imageTensor) {
    if (!this.model) return;
    return this.model.detect(imageTensor, 1, 0.6);

    // console.warn("this.model", this.model);
  }
}

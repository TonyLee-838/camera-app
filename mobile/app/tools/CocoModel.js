import * as coco from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";

import { COCO_MODEL_URL } from "../api/http";

class CocoModel {
  constructor() {
    this.init();
  }
  async init() {
    await tf.ready();
    await tf.getBackend();

    this.model = await coco.load({
      base: "lite_mobilenet_v2",
      modelUrl: COCO_MODEL_URL,
    });

    console.warn("load Coco success");
  }

  getBoundingBox(imageTensor) {
    if (!this.model) return;
    return this.model.detect(imageTensor, 1, 0.6);

    // console.warn("this.model", this.model);
  }
}

export default CocoModel;

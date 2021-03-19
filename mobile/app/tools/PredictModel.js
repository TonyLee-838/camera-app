import * as tf from "@tensorflow/tfjs";
import vector from "../data/eigenvectors.json";

import { PREDICT_MODEL_URL } from "../api/http";

export default class PredictModel {
  constructor(modelUrl) {
    this.IMAGE_SIZE = 224;
    this.inputMin = -1;
    this.inputMax = 1;
    this.normalizationConstant = (this.inputMax - this.inputMin) / 255.0;
    this.modelUrl = modelUrl;
    this.init();
  }

  init = async () => {
    await tf.ready();
    this.model = await tf.loadGraphModel(PREDICT_MODEL_URL);
    console.warn("load PredictModel success");
  };

  getImageCompressedTensorArray = (imageTensor) => {
    return tf.tidy(() => {
      const featureTensor = this.extractSingleImage(imageTensor, this.model);
      const compressedTensorArray = this.getReducedFeatures(featureTensor).arraySync();
      return compressedTensorArray[0];
    });
  };

  extractSingleImage = (image, model) => {
    return tf.tidy(() => {
      const preprocessedImageTensor = this.imagePreprocess(image);
      const featureTensor = this.infer(preprocessedImageTensor, model);
      return featureTensor;
    });
  };

  imagePreprocess = (decodedImage) => {
    return tf.tidy(() => {
      const normalized = tf.add(
        tf.mul(tf.cast(decodedImage, "float32"), this.normalizationConstant),
        this.inputMin
      );
      let resized = normalized;
      if (decodedImage.shape[0] !== this.IMAGE_SIZE || decodedImage.shape[1] !== this.IMAGE_SIZE) {
        const alignCorners = true;
        resized = tf.image.resizeBilinear(normalized, [this.IMAGE_SIZE, this.IMAGE_SIZE], alignCorners);
      }
      const batched = tf.reshape(resized, [-1, this.IMAGE_SIZE, this.IMAGE_SIZE, 3]);
      return batched;
    });
  };

  infer = (preprocessedImage, model) => {
    return tf.tidy(() => {
      const internal = model.execute(
        preprocessedImage,
        "module_apply_default/MobilenetV1/Logits/global_pool"
      );
      const result = tf.squeeze(internal, [1, 2]);
      return result;
    });
  };

  getReducedFeatures = (originalFeatures) => {
    return tf.tidy(() => {
      return originalFeatures.matMul(tf.tensor2d(vector));
    });
  };
}

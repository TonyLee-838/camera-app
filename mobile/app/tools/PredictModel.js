import * as tf from "@tensorflow/tfjs";
import vector from "../data/eigenvectors.json";

import {bundleResourceIO} from "@tensorflow/tfjs-react-native";
const modelJSON = require("../assets/model/predict/model.json");
const w1 = require("../assets/model/predict/group1-shard1of5.bin");
const w2 = require("../assets/model/predict/group1-shard2of5.bin");
const w3 = require("../assets/model/predict/group1-shard3of5.bin");
const w4 = require("../assets/model/predict/group1-shard4of5.bin");
const w5 = require("../assets/model/predict/group1-shard5of5.bin");

class PredictModel {
  constructor(modelUrl) {
    this.IMAGE_SIZE = 224;
    this.inputMin = -1;
    this.inputMax = 1;
    this.normalizationConstant = (this.inputMax - this.inputMin) / 255.0;
    this.init();
  }

  init = async () => {
    await tf.ready();
    this.model = await tf.loadGraphModel(bundleResourceIO(modelJSON, [w1,w2,w3,w4,w5]))
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

export default PredictModel;

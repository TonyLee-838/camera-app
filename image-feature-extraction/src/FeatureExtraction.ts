import * as tf from "@tensorflow/tfjs-node";
import * as fs from "fs";

import { getEigenvectors, getReducedFeatures } from "./Reduction";

interface Options {
  modelPath: string;
}

class FeatureExtraction {
  private options: Options;
  private IMAGE_SIZE = 224;
  private inputMin = -1;
  private inputMax = 1;
  private normalizationConstant = (this.inputMax - this.inputMin) / 255.0;

  constructor(options?: Options) {
    //Set default options
    this.options = options || { modelPath: "" };
  }

  async findEigenvectors(features: number[][]) {
    const eigenvectors = getEigenvectors(features, 500);
    return eigenvectors;
  }

  async compress(features: number[][], eigenvectors: number[][]) {
    return getReducedFeatures(tf.tensor2d(eigenvectors), tf.tensor2d(features)) as tf.Tensor2D;
  }

  loadModel() {
    return tf.loadGraphModel(this.options.modelPath);
  }

  async extractSingleImage(image: Buffer, model: tf.GraphModel) {
    return tf.tidy(() => {
      const preprocessedImageTensor = this.imagePreprocess(image);
      const featureTensor = this.infer(preprocessedImageTensor, model);

      return featureTensor.as1D().arraySync();
    });
  }

  private imagePreprocess(image: Buffer) {
    const decodedImage = tf.node.decodeJpeg(image, 3);

    const normalized: tf.Tensor3D = tf.add(
      tf.mul(tf.cast(decodedImage, "float32"), this.normalizationConstant),
      this.inputMin
    );
    const batched = tf.reshape(normalized, [-1, this.IMAGE_SIZE, this.IMAGE_SIZE, 3]);

    return batched;
  }

  private infer(preprocessedImage: tf.Tensor, model: tf.GraphModel) {
    return tf.tidy(() => {
      const internal = model.execute(
        preprocessedImage,
        "module_apply_default/MobilenetV1/Logits/global_pool"
      ) as tf.Tensor4D;

      const result: tf.Tensor2D = tf.squeeze(internal, [1, 2]);

      return result;
    });
  }
}

export default FeatureExtraction;

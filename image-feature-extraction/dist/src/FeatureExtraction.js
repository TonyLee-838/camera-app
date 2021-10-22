"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const tf = __importStar(require("@tensorflow/tfjs-node"));
const Reduction_1 = require("./Reduction");
class FeatureExtraction {
    constructor(options) {
        this.IMAGE_SIZE = 224;
        this.inputMin = -1;
        this.inputMax = 1;
        this.normalizationConstant = (this.inputMax - this.inputMin) / 255.0;
        //Set default options
        this.options = options || { modelPath: "" };
    }
    async findEigenvectors(features) {
        const eigenvectors = Reduction_1.getEigenvectors(features, 500);
        return eigenvectors;
    }
    async compress(features, eigenvectors) {
        return Reduction_1.getReducedFeatures(tf.tensor2d(eigenvectors), tf.tensor2d(features));
    }
    loadModel() {
        return tf.loadGraphModel(this.options.modelPath);
    }
    async extractSingleImage(image, model) {
        return tf.tidy(() => {
            const preprocessedImageTensor = this.imagePreprocess(image);
            const featureTensor = this.infer(preprocessedImageTensor, model);
            return featureTensor.as1D().arraySync();
        });
    }
    imagePreprocess(image) {
        const decodedImage = tf.node.decodeJpeg(image, 3);
        const normalized = tf.add(tf.mul(tf.cast(decodedImage, "float32"), this.normalizationConstant), this.inputMin);
        const batched = tf.reshape(normalized, [-1, this.IMAGE_SIZE, this.IMAGE_SIZE, 3]);
        return batched;
    }
    infer(preprocessedImage, model) {
        return tf.tidy(() => {
            const internal = model.execute(preprocessedImage, "module_apply_default/MobilenetV1/Logits/global_pool");
            const result = tf.squeeze(internal, [1, 2]);
            return result;
        });
    }
}
exports.default = FeatureExtraction;

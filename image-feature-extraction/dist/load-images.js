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
const arrayShuffle = require("array-shuffle");
const tf = __importStar(require("@tensorflow/tfjs-node"));
const loadImages = (allImageFeatures, allImageNames) => {
    let data = allImageFeatures.map((features, i) => ({ features, name: allImageNames[i] }));
    data = arrayShuffle(data);
    const trainingSet = {
        features: tf.tensor(data.map((obj) => obj.features)),
        imageIndexes: tf.range(0, data.length).as2D(data.length, 1),
        imagePaths: data.map((obj) => obj.name),
    };
    return trainingSet;
};
exports.default = loadImages;

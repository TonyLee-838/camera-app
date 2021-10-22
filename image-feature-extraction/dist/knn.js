"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const knn = (predictionTensor, features, labels, k = 1) => {
    return features
        .sub(predictionTensor)
        .pow(2)
        .sum(1)
        .pow(0.5)
        .expandDims(1)
        .concat(labels, 1)
        .unstack(0)
        .sort(sortable)
        .slice(0, k)
        .map(mapper);
};
const sortable = (tensorA, tensorB) => {
    const valueA = tensorA.bufferSync().get(0);
    const valueB = tensorB.bufferSync().get(0);
    return valueA > valueB ? 1 : -1;
};
const mapper = (tensor) => {
    return {
        imageIndex: tensor.bufferSync().get(1),
        distance: tensor.bufferSync().get(0),
    };
};
exports.default = knn;

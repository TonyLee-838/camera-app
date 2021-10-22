"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEigenvectors = exports.getReducedFeatures = void 0;
const ml_matrix_1 = require("ml-matrix");
// import * as fs from "fs";
// interface OriginalStoredData {
//   imagePath: string;
//   features: number[];
// }
const getReducedFeatures = (eigenvectors, originalFeatures) => {
    return originalFeatures.matMul(eigenvectors);
};
exports.getReducedFeatures = getReducedFeatures;
const getEigenvectors = (features, dimensions = 200) => {
    console.log("Finding Eigenvectors...");
    const matrix = new ml_matrix_1.Matrix(features);
    const dataCount = matrix.rows;
    const mean = matrix.mean("column");
    const standardDeviation = matrix.standardDeviation("column");
    const standardized = matrix.subRowVector(mean).divRowVector(standardDeviation);
    console.log("Calculating COV...");
    const cov = standardized.transpose().mmul(standardized).div(dataCount);
    console.log("Calculating SVD...");
    const svd = new ml_matrix_1.SVD(cov);
    const V = svd.rightSingularVectors;
    console.log("Reducing to perfect size...");
    const array = new Array(dimensions).fill(0).map((_, i) => i);
    const result = V.subMatrixColumn(array).to2DArray();
    return result;
};
exports.getEigenvectors = getEigenvectors;
// class FeatureReduction {
//   private dimensions: number;
//   constructor(dimensions: number) {
//     this.dimensions = dimensions;
//   }
//   private loadOriginalData(inputPath: string) {
//     const data: OriginalStoredData[] = JSON.parse(fs.readFileSync(inputPath, "utf-8")).data;
//     return new Matrix(data.map((obj) => obj.matrix));
//   }
//   writeEigenvectors(inputPath: string, outputPath: string) {
//     const features = this.loadOriginalData(inputPath);
//     const eigenvectors = this.getEigenvectors(features);
//     fs.writeFileSync(outputPath, JSON.stringify({ eigenvectors }));
//   }
//   mapData(data: number[][], eigenvectors: number[][]) {
//     const originalDataMatrix = new Matrix(data);
//     const eigenvectorMatrix = new Matrix(eigenvectors);
//     const before = new Date();
//     const result = originalDataMatrix.mmul(eigenvectorMatrix);
//     const after = new Date();
//     console.log("Map time", (after.getTime() - before.getTime()) / 1000);
//     return result.to2DArray();
//   }
//   private getEigenvectors(features: Matrix) {
//     const dataCount = features.rows;
//     const startTime = new Date();
//     const mean = features.mean("column");
//     const meanTime = new Date();
//     console.log("meanTime", (meanTime.getTime() - startTime.getTime()) / 1000);
//     const standardDeviation = features.standardDeviation("column");
//     const standardDeviationTime = new Date();
//     console.log("standardDeviationTime", (standardDeviationTime.getTime() - startTime.getTime()) / 1000);
//     const standardized = features.subRowVector(mean).divRowVector(standardDeviation);
//     const standardizedTime = new Date();
//     console.log("standardizedTime", (standardizedTime.getTime() - startTime.getTime()) / 1000);
//     const cov = standardized.transpose().mmul(standardized).div(dataCount);
//     const covTime = new Date();
//     console.log("covTime", (covTime.getTime() - startTime.getTime()) / 1000);
//     const svd = new SVD(cov);
//     const svdTime = new Date();
//     console.log("svdTime", (svdTime.getTime() - startTime.getTime()) / 1000);
//     const V = svd.rightSingularVectors;
//     const array = new Array(this.dimensions).fill(0).map((_, i) => i);
//     const result = V.subMatrixColumn(array).to2DArray();
//     const cutTime = new Date();
//     console.log("cutTime", (cutTime.getTime() - startTime.getTime()) / 1000);
//     return result;
//   }
// }
// export default FeatureReduction;

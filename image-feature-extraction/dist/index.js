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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FeatureExtraction_1 = __importDefault(require("./FeatureExtraction"));
const log_update_1 = __importDefault(require("log-update"));
const fs = __importStar(require("fs"));
//模型存放地址
const MODEL_PATH = "file://./assets/model/model.json";
//輸出1024維的圖片特徵
const OUTPUT_EXTRACTED_PATH = "./out/extracted-features.json";
//輸出特徵向量
const OUTPUT_EIGENVECTORS = "./out/eigenvectors.json";
//輸出壓縮好的圖片特徵
const OUTPUT_COMPRESSED_PATH = "./out/model-compressed-features.json";
//輸出不能讀取的圖片名 日後再處理
const OUTPUT_ERROR_IMAGES = "./out/errors.json";
//存放素材圖片
const IMAGES_PATH = "./assets/images";
//存放測試圖片
const TEST_IMAGES_PATH = "./assets/test-images";
const OUTPUT_INDEX_PATH = "./out/index.ann";
const getImageList = () => {
    return fs.readdirSync(IMAGES_PATH).slice(0, 2000);
};
const readImage = (image) => {
    return fs.readFileSync(`./assets/images/${image}`);
};
const compress = async () => {
    const extraction = new FeatureExtraction_1.default({
        modelPath: MODEL_PATH,
    });
    console.log('read model')
    const eigenvectors = JSON.parse(fs.readFileSync(OUTPUT_EIGENVECTORS, "utf-8"));
    console.log('read vector')
    const features = JSON.parse(fs.readFileSync(OUTPUT_EXTRACTED_PATH, "utf-8"));
    console.log('read feature')
    const result = await extraction.compress(features, eigenvectors);
    console.log('result')
    fs.writeFileSync(OUTPUT_COMPRESSED_PATH, JSON.stringify(result.arraySync()), "utf-8");
    console.log("Success");
};
// const storeWithAnn = () => {
//   const compressed = JSON.parse(fs.readFileSync(OUTPUT_COMPRESSED_PATH, "utf-8"));
//   saveIndex(compressed, OUTPUT_INDEX_PATH, {
//     dimensions: 500,
//     metric: "Angular",
//   });
//   console.log("Finished");
// };
const extractFeatures = async (end = -1) => {
    const extraction = new FeatureExtraction_1.default({
        modelPath: MODEL_PATH,
    });
    const model = await extraction.loadModel();
    const imageList = fs.readdirSync(IMAGES_PATH).slice(0, end);
    fs.writeFileSync(OUTPUT_EXTRACTED_PATH, "[");
    fs.writeFileSync(OUTPUT_ERROR_IMAGES, "[");
    for (let index = 0; index < imageList.length; index++) {
        const path = `./assets/images/${imageList[index]}`;
        const buffer = fs.readFileSync(path);
        //const time1= new Date()
        try {
            const features = await extraction.extractSingleImage(buffer, model);
            fs.appendFileSync(OUTPUT_EXTRACTED_PATH, JSON.stringify(features));
            if (index < imageList.length - 1) {
                fs.appendFileSync(OUTPUT_EXTRACTED_PATH, ",\n");
            }
        }
        catch (error) {
            fs.appendFileSync(OUTPUT_ERROR_IMAGES, JSON.stringify({ path, index }) + ",\n");
        }
        //const time2= new Date()
        log_update_1.default(`Processing: ${index + 1}/${imageList.length}`);
    }
    console.log("Outputting result...");
    fs.appendFileSync(OUTPUT_EXTRACTED_PATH, "]");
    fs.appendFileSync(OUTPUT_ERROR_IMAGES, "]");
};
const getEigenvectors = async () => {
    const extraction = new FeatureExtraction_1.default({
        modelPath: MODEL_PATH,
    });
    const features = JSON.parse(fs.readFileSync(OUTPUT_EXTRACTED_PATH, "utf-8"));
    const eigenvectors = await extraction.findEigenvectors(features);
    fs.writeFileSync(OUTPUT_EIGENVECTORS, JSON.stringify(eigenvectors));
    console.log("Success!");
};
// const predict = async () => {
//   try {
//     const trainingImageNames = fs.readdirSync(IMAGES_PATH);
//     const eigenvectors = JSON.parse(fs.readFileSync(OUTPUT_EIGENVECTORS, "utf-8"));
//     const testImageList = fs.readdirSync(TEST_IMAGES_PATH).slice(0, 50);
//     const record: Record = {
//       source: [],
//       prediction: [],
//     };
//     const extraction = new FeatureExtraction({ modelPath: MODEL_PATH });
//     const model = await extraction.loadModel();
//     let totalProcessTime = 0;
//     for (let i = 0; i < testImageList.length; i++) {
//       const testImageName = testImageList[i];
//       const image = fs.readFileSync(`${TEST_IMAGES_PATH}/${testImageName}`);
//       const extracted = await extraction.extractSingleImage(image, model);
//       const compressed: tf.Tensor2D = await extraction.compress([extracted], eigenvectors);
//       const flatted = compressed.arraySync()[0];
//       record.source.push(testImageName);
//       const time2 = new Date();
//       const prediction = getTopKSimilarImages(flatted, OUTPUT_INDEX_PATH, {
//         dimensions: 500,
//         k: 1,
//         metric: "Angular",
//       });
//       const imageIndex = prediction.neighbors[0];
//       const imageName = trainingImageNames[imageIndex];
//       const processTime = new Date().getTime() - time2.getTime();
//       totalProcessTime += processTime;
//       console.log("ANN", i + 1, processTime, "ms");
//       record.prediction.push(imageName);
//     }
//     console.log("AVG process time:", (totalProcessTime / testImageList.length).toFixed(2), "ms");
//     fs.writeFileSync("./out/predict.json", JSON.stringify(record));
//   } catch (error) {
//     console.warn(error);
//   }
// };
// extractFeatures()
// getEigenvectors();
compress();
// storeWithAnn();
//  predict();

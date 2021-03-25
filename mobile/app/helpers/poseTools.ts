import {
  getRegulatedImageKeypoints,
  getRegulatedUserKeypoints,
} from "./regulatePosition";

import { Keypoint } from "../models/posenet";
import { PoseData, Dimensions2D, CheckProgress, Point } from "../types/index";

export const getDistanceBetweenTwoPoints = (
  x1: number,
  x2: number,
  y1: number,
  y2: number
) => {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
};

export const getDistanceBetweenTwoPoints2 = (point1: Point, point2: Point) => {
  return getDistanceBetweenTwoPoints(point1.x, point2.x, point1.y, point2.y);
};

export const getPointMap = (keypoints: Keypoint[]) => {
  return keypoints.reduce((result, point) => {
    result[point.part] = point;
    return result;
  }, {});
};

export const getRegulatedUserPointMap = (
  pose: PoseData,
  dimensions: Dimensions2D
) => {
  const keyPoints = getRegulatedUserKeypoints(pose, dimensions);
  return getPointMap(keyPoints);
};

export const getRegulatedImagePointMap = (
  pose: PoseData,
  dimensions: Dimensions2D
) => {
  const keyPoints = getRegulatedImageKeypoints(pose, dimensions);
  return getPointMap(keyPoints);
};

// 定义每个阶段需要检查的身体部位
const legParts = [
  "leftHip",
  "leftKnee",
  "leftAnkle",
  "rightHip",
  "rightKnee",
  "rightAnkle",
];
const armParts = [
  "leftShoulder",
  "leftElbow",
  "leftWrist",
  "rightShoulder",
  "rightElbow",
  "rightWrist",
];
const headParts = ["leftEye", "rightEye", "nose"];

//定义每个阶段的检查阈值
const LEGS_THRESHOLD = 50;
const ARMS_THRESHOLD = 40;
const HEAD_THRESHOLD = 10;

const partsDictionary = {
  legs: {
    parts: legParts,
    threshold: LEGS_THRESHOLD,
  },
  arms: {
    parts: armParts,
    threshold: ARMS_THRESHOLD,
  },
  head: {
    parts: headParts,
    threshold: HEAD_THRESHOLD,
  },
};

export const checkParts = (
  userPointMap,
  imagePointMap,
  checkProgress: CheckProgress
) => {
  //当前需要检查的所有身体部位
  const parts = partsDictionary[checkProgress].parts;
  //当前需要检查的所有身体部位的阈值
  const threshold = partsDictionary[checkProgress].threshold;

  //遍历需要检查的身体部位
  for (let i = 0; i < parts.length; i++) {
    //item为当前要检查的某个身体部位
    const item = parts[i];
    //如果用户和图像都有这个部位
    if (userPointMap[item] && imagePointMap[item]) {
      //判断这两个部位的距离
      const distance = getDistanceBetweenTwoPoints2(
        userPointMap[item].position,
        imagePointMap[item].position
      );
      if (distance > threshold) return false;
    }
  }

  return true;
};

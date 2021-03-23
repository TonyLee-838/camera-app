import { Keypoint } from '../models/posenet';
import { Dimensions2D, PoseData } from '../types';

export const getDistanceOfTwoPoints = (x1: number, x2: number, y1: number, y2: number) => {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
};

export const getDistancesOfKeypoints = (
  keypoints1: Keypoint[],
  keypoints2: Keypoint[],
  fulfillThreshold: number
) => {
  const p1 = keypoints1.reduce((result, point) => {
    result[point.part] = point.position;
    return result;
  }, {});

  const p2 = keypoints2.reduce((result, point) => {
    result[point.part] = point.position;
    return result;
  }, {});

  let allFulfilled = true;

  const map = Object.keys(p1).reduce((map, p1Key) => {
    if (!p2[p1Key]) return map;

    const { x: x1, y: y1 } = p1[p1Key];
    const { x: x2, y: y2 } = p2[p1Key];

    const distance = getDistanceOfTwoPoints(x1, x2, y1, y2);

    const fulfilled = distance <= fulfillThreshold;

    allFulfilled = allFulfilled && fulfilled;

    map[p1Key] = {
      distance,
      fulfilled,
    };

    return map;
  }, {});

  return { map, allFulfilled };
};

const data1 = [
  {
    part: 'nose',
    position: { x: 467, y: 390 },
    score: 1,
  },
  {
    part: 'leftEye',
    position: { x: 478, y: 354 },
    score: 1,
  },
  {
    part: 'rightEye',
    position: { x: 406, y: 370 },
    score: 1,
  },
  {
    part: 'leftShoulder',
    position: { x: 545, y: 489 },
    score: 1,
  },
  {
    part: 'rightShoulder',
    position: { x: 420, y: 509 },
    score: 1,
  },
  {
    part: 'leftElbow',
    position: { x: 572, y: 261 },
    score: 1,
  },
  {
    part: 'rightElbow',
    position: { x: 373, y: 283 },
    score: 1,
  },
  {
    part: 'leftWrist',
    position: { x: 510, y: 110 },
    score: 1,
  },
  {
    part: 'rightWrist',
    position: { x: 400, y: 135 },
    score: 1,
  },
  {
    part: 'leftHip',
    position: { x: 493, y: 846 },
    score: 1,
  },
  {
    part: 'rightHip',
    position: { x: 343, y: 832 },
    score: 1,
  },
  {
    part: 'leftKnee',
    position: { x: 340, y: 941 },
    score: 1,
  },
  {
    part: 'rightKnee',
    position: { x: 281, y: 938 },
    score: 1,
  },
  {
    part: 'leftAnkle',
    position: { x: 398, y: 1335 },
    score: 1,
  },
];
const data2 = [
  {
    part: 'nose',
    position: { x: 487, y: 390 },
    score: 1,
  },
  {
    part: 'leftEye',
    position: { x: 428, y: 354 },
    score: 1,
  },
  {
    part: 'rightEye',
    position: { x: 436, y: 370 },
    score: 1,
  },
  {
    part: 'leftShoulder',
    position: { x: 545, y: 489 },
    score: 1,
  },
  {
    part: 'rightShoulder',
    position: { x: 410, y: 509 },
    score: 1,
  },
  {
    part: 'leftElbow',
    position: { x: 572, y: 261 },
    score: 1,
  },
  {
    part: 'rightElbow',
    position: { x: 373, y: 283 },
    score: 1,
  },
  {
    part: 'leftWrist',
    position: { x: 510, y: 110 },
    score: 1,
  },
  {
    part: 'rightWrist',
    position: { x: 400, y: 135 },
    score: 1,
  },
  {
    part: 'leftHip',
    position: { x: 493, y: 846 },
    score: 1,
  },
  {
    part: 'rightHip',
    position: { x: 343, y: 832 },
    score: 1,
  },
  {
    part: 'leftKnee',
    position: { x: 340, y: 941 },
    score: 1,
  },
  {
    part: 'rightKnee',
    position: { x: 281, y: 938 },
    score: 1,
  },
  {
    part: 'leftAnkle',
    position: { x: 398, y: 1335 },
    score: 1,
  },
  {
    part: 'rightAnkle',
    position: { x: 178, y: 1343 },
    score: 1,
  },
];

// console.log(getDistancesOfKeypoints(data1, data2, 10));
// console.log(Object.keys(getDistancesOfKeypoints(data1, data2, 10).map).length);

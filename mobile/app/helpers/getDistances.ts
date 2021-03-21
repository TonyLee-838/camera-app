import { Keypoint } from '../tools/posenet';
import { Dimensions2D, PoseData } from '../types';

const getDistanceOfTwoPoints = (x1: number, x2: number, y1: number, y2: number) => {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
};

export const getDistancesOfKeypoints = (
  keypoints1: Keypoint[],
  keypoint2: Keypoint[],
  fulfillThreshold: number
) => {
  const p1 = keypoints1.reduce((result, point) => {
    result[point.part] = point.position;
    return result;
  }, {});

  const p2 = keypoint2.reduce((result, point) => {
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

    allFulfilled = fulfilled;

    // map.push({ part: p1Key, fulfilled });
    map[p1Key] = fulfilled;

    return map;
  }, {});

  return { map, allFulfilled };
};

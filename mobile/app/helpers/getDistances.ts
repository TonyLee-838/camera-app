import { Keypoint } from '../models/posenet';

export const getDistanceBetweenTwoPoints = (x1: number, x2: number, y1: number, y2: number) => {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
};

export const getPointMap = (keypoints: Keypoint[]) => {
  return keypoints.reduce((result, point) => {
    result[point.part] = point;
    return result;
  }, {});
};

export const getDistancesOfKeypoints = (
  keypoints1: Keypoint[],
  keypoints2: Keypoint[],
  fulfillThreshold: number
) => {
  const map1 = getPointMap(keypoints1);
  const map2 = getPointMap(keypoints2);

  let allFulfilled = true;

  const map = Object.keys(map1).reduce((map, key) => {
    if (!map2[key]) return map;

    const { x: x1, y: y1 } = map1[key].position;
    const { x: x2, y: y2 } = map2[key].position;

    const distance = getDistanceBetweenTwoPoints(x1, x2, y1, y2);

    const fulfilled = distance <= fulfillThreshold;

    allFulfilled = allFulfilled && fulfilled;

    map[key] = {
      distance,
      fulfilled,
    };

    return map;
  }, {});

  return { map, allFulfilled };
};

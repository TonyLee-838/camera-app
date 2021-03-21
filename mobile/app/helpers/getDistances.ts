import { Dimensions2D, PoseData } from '../types';

const getDistanceOfTwoPoints = (x1: number, x2: number, y1: number, y2: number) => {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
};

export const getDistancesOfKeypoints = (pose1: PoseData, pose2: PoseData, fulfillThreshold: number) => {
  const p1 = pose1.keypoints.reduce((result, point) => {
    result[point.part] = point.position;
    return result;
  }, {});

  const p2 = pose2.keypoints.reduce((result, point) => {
    result[point.part] = point.position;
    return result;
  }, {});

  let isFulfilled = true;

  const map = Object.keys(p1).reduce((distances, p1Key) => {
    if (!p2[p1Key]) return distances;

    const { x: x1, y: y1 } = p1[p1Key];
    const { x: x2, y: y2 } = p2[p1Key];

    const distance = getDistanceOfTwoPoints(x1, x2, y1, y2);

    distances.push({ part: p1Key, distance });

    if (distance > fulfillThreshold) isFulfilled = false;

    return distances;
  }, []);

  return {
    map,
    isFulfilled,
  };
};

import { RegulatedBox, BoxPoints, BoxPosition, UserStatus } from '../types/index';
import { DetectedObject } from '../models/coco-ssd/index';

// 将{x,y,width,height} 转化为包含2个顶点的数组： [ {x,y},{x,y} ]
export const boxToPoints = (box: RegulatedBox): BoxPoints => {
  const points: BoxPoints = [
    { x: box.x, y: box.y },
    { x: box.x + box.width, y: box.y + box.height },
  ];

  return points;
};

// 判断CocoModel返回的box是否是空的，是否包含“人”，对这些特殊情况进行处理，防止程序报错
const MIN_CONFIDENCE = 0.5;

export const findPersonBox = (box: DetectedObject[]): BoxPosition => {
  if (!box.length) return [0, 0, 0, 0];

  const result = box.find((b) => b.class === 'person' && b.score >= MIN_CONFIDENCE);

  return result ? result.bbox : [0, 0, 0, 0];
};

// 推断用户当前所处的状态:“太远了”，“太近了”，“刚好”，“需要微调”，"无人"
const VERTICAL_THRESHOLD = 50;
const HORIZONTAL_THRESHOLD = 50;

export const inferUserStatus = (userBox: RegulatedBox, imageBox: RegulatedBox): UserStatus => {
  if (userBox.width === 0 && userBox.height === 0) return 'none';

  const userPoints = boxToPoints(userBox);
  const imagePoints = boxToPoints(imageBox);

  const verticalResult = matchVertical(userPoints, imagePoints);
  if (verticalResult !== 'fine') return verticalResult;

  return matchHorizontal(userPoints, imagePoints);
};

const matchVertical = (userPoints: BoxPoints, imagePoints: BoxPoints): UserStatus => {
  const userVertical = Math.abs(userPoints[0].y - userPoints[1].y);
  const imageVertical = Math.abs(imagePoints[0].y - imagePoints[1].y);

  if (userVertical + VERTICAL_THRESHOLD < imageVertical) return 'tooFar';
  if (imageVertical + VERTICAL_THRESHOLD < userVertical) return 'tooClose';
  if (
    userPoints[0].y + VERTICAL_THRESHOLD < imagePoints[0].y &&
    userPoints[1].y + VERTICAL_THRESHOLD < imagePoints[1].y
  )
    return 'tooLow';
  if (
    userPoints[0].y > imagePoints[0].y + VERTICAL_THRESHOLD &&
    userPoints[1].y > imagePoints[1].y + VERTICAL_THRESHOLD
  )
    return 'tooHigh';

  return 'fine';
};

const matchHorizontal = (userPoints: BoxPoints, imagePoints: BoxPoints): UserStatus => {
  if (
    userPoints[0].x + HORIZONTAL_THRESHOLD < imagePoints[0].x &&
    userPoints[1].x + HORIZONTAL_THRESHOLD < imagePoints[1].x
  )
    return 'tooLeft';

  if (
    userPoints[0].x > imagePoints[0].x + HORIZONTAL_THRESHOLD &&
    userPoints[1].x > imagePoints[1].x + HORIZONTAL_THRESHOLD
  )
    return 'tooRight';
  return 'fine';
};

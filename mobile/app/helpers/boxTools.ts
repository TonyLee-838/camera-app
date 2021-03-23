import {
  regulatedBox,
  boxPoints,
  BoxPosition,
  userState,
} from "../types/index";
import { DetectedObject } from "../models/coco-ssd/index";
import { getDistanceOfTwoPoints } from "../helpers/getDistances";

// 将{x,y,width,height} 转化为包含四个顶点的数组： [ {x,y},{x,y},{x,y},{x,y} ]
export const boxToPoints = (box: regulatedBox): boxPoints => {
  const points: boxPoints = [
    { x: box.x, y: box.y },
    { x: box.x, y: box.y + box.height },
    { x: box.x + box.width, y: box.y },
    { x: box.x + box.width, y: box.y + box.height },
  ];
  return points;
};

// 判断CocoModel返回的box是否是空的，是否包含“人”，对这些特殊情况进行处理，防止程序报错
export const regulateBoxFromCocoModel = (
  box: DetectedObject[]
): BoxPosition => {
  if (box.length === 0) {
    return [0, 0, 0, 0];
  }
  for (let i = 0; i < box.length; i++) {
    if (box[i].class === "person") {
      return box[i].bbox;
    }
  }
  return [0, 0, 0, 0];
};

// 推断用户当前所处的状态:“太远了”，“太近了”，“刚好”，“需要微调”，"无人"
const CLOSE_THRESHOLD = 2, FAR_THRESHOLD = 1 / CLOSE_THRESHOLD;

export const inferUserState = (
  userBox: regulatedBox,
  imageBox: regulatedBox,
  threshold: number
): userState => {
  if (userBox.width === 0 && userBox.height === 0) return "no-person";

  const userPoints = boxToPoints(userBox);
  const imagePoints = boxToPoints(imageBox);
  let count = 0;
  for (let i = 0; i < 4; i++) {
    const dis = getDistanceOfTwoPoints(
      userPoints[i].x,
      imagePoints[i].x,
      userPoints[i].y,
      imagePoints[i].y
    );
    if (dis <= threshold) count++;
  }
  if (count >= 2) return "ok";

  const userArea = userBox.height * userBox.width;
  const imageArea = imageBox.height * imageBox.width;
  const ratio = userArea / imageArea;
  if (ratio >= CLOSE_THRESHOLD) return "close";
  if (ratio <= FAR_THRESHOLD) return "far";

  return "offset";
};

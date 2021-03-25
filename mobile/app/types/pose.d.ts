export { Keypoint } from "@tensorflow-models/posenet";

export interface PoseData {
  keypoints: Keypoint[];
  dimensions: Dimensions2D;
  // width: number;
  // height: number;
}

export interface Dimensions2D {
  width: number;
  height: number;
}

export interface PoseResponse {
  image: {
    height: number;
    width: number;
    x1: number;
    x2: number;
    y1: number;
    y2: number;
  };
  parts: Part[];
}

export interface Part {
  label: string;
  x: number;
  y: number;
}

export interface KeypointDistanceMap {
  [index: string]: {
    fulfilled: boolean;
    distance: number;
  };
}

export interface Point {
  x: number;
  y: number;
}

export type Part =
  | "nose"
  | "leftEye"
  | "rightEye"
  | "leftEar"
  | "rightEar"
  | "leftShoulder"
  | "rightShoulder"
  | "leftElbow"
  | "rightElbow"
  | "leftWrist"
  | "rightWrist"
  | "leftHip"
  | "rightHip"
  | "leftKnee"
  | "rightKnee"
  | "leftAnkle"
  | "rightAnkle";

export type CheckStatus = "ready" | "now" | "fine";
export type CheckProgress = "legs" | "arms" | "head";

// export interface PointMapItem{
//   [key: Part]:{

//     position: Point;
//     status: checkStatus;
//   }
// }

// export type PointMap = {PointMapItem}

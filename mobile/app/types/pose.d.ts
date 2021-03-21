export { Keypoint } from '@tensorflow-models/posenet';

export interface PoseData {
  keypoints: Keypoint[];
  width: number;
  height: number;
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
  [index: string]: boolean;
}

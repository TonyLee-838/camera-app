import { Dimensions2D, BoxPosition } from '../types';

const CONTROL_SPACE_HEIGHT_PERCENTAGE = 0.18;
const CONTROL_SPACE_HEIGHT = 120;

export const regulateImagePosePosition = (
  x: number,
  y: number,
  imageDimensions: Dimensions2D,
  deviceDimensions: Dimensions2D
) => {
  const ratio = deviceDimensions.width / imageDimensions.width;

  const imageHeight = imageDimensions.height * ratio;
  const cameraHeight = (1 - CONTROL_SPACE_HEIGHT_PERCENTAGE) * deviceDimensions.height;
  const offset = (cameraHeight - imageHeight) / 2;
  const _y = y * ratio;

  return {
    x: x * ratio,
    y: 0.5 * cameraHeight - (0.5 * imageHeight - _y) - offset,
  };
};

export const regulateUserPosePosition = (
  x: number,
  y: number,
  inputDimensions: Dimensions2D,
  deviceDimensions: Dimensions2D
) => {
  return {
    x: (x * deviceDimensions.width) / inputDimensions.width,
    y:
      (0.5 * deviceDimensions.height -
        ((0.5 * inputDimensions.height - y) * deviceDimensions.width) / inputDimensions.width) *
      (1 - CONTROL_SPACE_HEIGHT_PERCENTAGE),
  };
};

export const regulateImageBoxPosition = (
  position: BoxPosition,
  imageDimensions: Dimensions2D,
  deviceDimensions: Dimensions2D
) => {
  const x = position[0];
  const y = position[1];
  const width = position[2];
  const height = position[3];
  return {
    x: (x / imageDimensions.width) * deviceDimensions.width,
    y: (y / imageDimensions.height) * deviceDimensions.height * 0.82,
    width: (width * deviceDimensions.width) / imageDimensions.width,
    height: ((height * deviceDimensions.height) / imageDimensions.height) * 0.82,
  };
};

export const regulateUserBoxPosition = (
  position: BoxPosition,
  imageDimensions: Dimensions2D,
  deviceDimensions: Dimensions2D
) => {
  const x = position[0];
  const y = position[1];
  const width = position[2];
  const height = position[3];

  return {
     //x: ((imageDimensions.width - x) * deviceDimensions.width) / imageDimensions.width ,
     x: ((imageDimensions.width - x) * deviceDimensions.width) / imageDimensions.width - ( width * deviceDimensions.width) / imageDimensions.width,
    y:
      (deviceDimensions.height - CONTROL_SPACE_HEIGHT) / 2 -
      ((0.5 * imageDimensions.height - y) * deviceDimensions.width) / imageDimensions.width,
     width: ( width * deviceDimensions.width) / imageDimensions.width,
     //width: (-1*width * deviceDimensions.width) / imageDimensions.width,
    height: (height * deviceDimensions.height) / imageDimensions.height,

  };


};



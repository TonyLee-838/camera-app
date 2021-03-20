import { Dimensions2D } from "../types";

const CONTROL_SPACE_HEIGHT_PERCENTAGE = 0.18;

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

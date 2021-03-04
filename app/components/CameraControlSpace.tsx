import React, { FC, ReactElement } from "react";
import { View, StyleSheet, GestureResponderEvent } from "react-native";

import CaptureButton from "./CaptureButton";
import ControlSpace from "./common/ControlSpace";
import colors from "../config/colors";

interface CameraControlSpaceProps {
  onCapture: (event: GestureResponderEvent) => void;
}

const CameraControlSpace: FC<CameraControlSpaceProps> = ({ onCapture }): ReactElement => {
  return (
    <ControlSpace>
      <CaptureButton onPress={onCapture} />
    </ControlSpace>
  );
};

export default CameraControlSpace;

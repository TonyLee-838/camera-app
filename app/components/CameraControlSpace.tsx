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

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: colors.white,
    position: "absolute",
    bottom: 0,
    display: "flex",
    alignItems: "center",
  },
});
export default CameraControlSpace;

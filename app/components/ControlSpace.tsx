import React, { FC, ReactElement } from "react";
import { View, StyleSheet, GestureResponderEvent } from "react-native";

import colors from "../config/colors";
import CaptureButton from "./CaptureButton";

interface ControlSpaceProps {
  onCapture: (event: GestureResponderEvent) => void;
}

const ControlSpace: FC<ControlSpaceProps> = ({ onCapture }): ReactElement => {
  return (
    <View style={styles.container}>
      <CaptureButton onPress={onCapture} />
    </View>
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
export default ControlSpace;

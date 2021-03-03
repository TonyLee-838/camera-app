import React, { FC, ReactElement } from "react";
import { View, StyleSheet, TouchableOpacity, GestureResponderEvent } from "react-native";

import colors from "../config/colors";

interface CaptureButtonProps {
  onPress: (event: GestureResponderEvent) => void;
}

const CaptureButton: FC<CaptureButtonProps> = ({ onPress }): ReactElement => {
  return (
    <View style={styles.background}>
      <TouchableOpacity style={styles.button} onPress={onPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    backgroundColor: colors.primary,
  },
  background: {
    width: 85,
    height: 85,
    borderRadius: 50,
    bottom: 20,
    borderColor: colors.white,
    backgroundColor: colors.white,
    borderWidth: 5,
  },
});
export default CaptureButton;

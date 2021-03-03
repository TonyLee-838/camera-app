import React from "react";
import { StyleSheet, View } from "react-native";

import AppCamera from "../components/AppCamera";
import CaptureButton from "../components/CaptureButton";
import ControlSpace from "../components/ControlSpace";
import colors from "../config/colors";

const CameraScreen = () => {
  const handlePress = () => {
    console.warn("Pressed");
  };

  return (
    <View style={styles.container}>
      <AppCamera />
      <ControlSpace>
        <CaptureButton onPress={handlePress} />
      </ControlSpace>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.white,
    alignItems: "center",
  },
});

export default CameraScreen;

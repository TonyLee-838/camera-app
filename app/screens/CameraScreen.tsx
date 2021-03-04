import React from "react";
import { StyleSheet, View } from "react-native";

import AppCamera from "../components/AppCamera";
import CaptureButton from "../components/CaptureButton";

const CameraScreen = () => {
  const handlePress = () => {
    console.log("Pressed");
  };

  return (
    <View style={styles.container}>
      <AppCamera />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  controllers: {},
});

export default CameraScreen;

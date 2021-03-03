import React from "react";
import { StyleSheet } from "react-native";

import CameraScreen from "./app/screens/CameraScreen";

export default function App() {
  return <CameraScreen />;
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    height: "100%",
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
});

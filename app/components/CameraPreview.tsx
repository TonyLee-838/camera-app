import React, { FC, ReactElement } from "react";
import { View, StyleSheet, ImageBackground, GestureResponderEvent } from "react-native";
import { CameraCapturedPicture } from "expo-camera";

import PreviewControlSpace from "./PreviewControlSpace";

interface CameraPreviewProps {
  photo: CameraCapturedPicture;
  onRetake: (event: GestureResponderEvent) => void;
  onSavePhoto: (event: GestureResponderEvent) => void;
}

const CameraPreview: FC<CameraPreviewProps> = ({ photo, onRetake, onSavePhoto }): ReactElement => {
  return (
    <View style={styles.container}>
      <ImageBackground style={styles.image} source={{ uri: photo.uri }} />
      <PreviewControlSpace onRetake={onRetake} onSavePhoto={onSavePhoto} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    flex: 1,
    width: "100%",
    height: "100%",
  },
  image: {
    flex: 1,
  },
});
export default CameraPreview;

import { CameraCapturedPicture } from "expo-camera";
import React, { FC, ReactElement } from "react";
import { View, StyleSheet, ImageBackground } from "react-native";

interface CameraPreviewProps {
  photo: CameraCapturedPicture;
}

const CameraPreview: FC<CameraPreviewProps> = ({ photo }): ReactElement => {
  return (
    <View style={styles.container}>
      <ImageBackground style={styles.image} source={{ uri: photo.uri }} />
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

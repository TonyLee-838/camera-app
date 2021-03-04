import React, { useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { Camera, CameraCapturedPicture } from "expo-camera";
import { CameraType } from "expo-camera/build/Camera.types";

import CameraControlSpace from "./CameraControlSpace";
import CameraPreview from "./CameraPreview";

const getPermission = async () => {
  const { status } = await Camera.requestPermissionsAsync();
  return status === "granted";
};

const takePhoto = async (camera: Camera) => {
  const photo = await camera.takePictureAsync();
  return photo;
};

const AppCamera: React.FC = () => {
  let camera: Camera | null;

  const [canRunCamera, setCanRunCamera] = useState<boolean>(false);
  const [canPreviewPhoto, setCanPreviewPhoto] = useState<boolean>(false);

  const [cameraType, setCameraType] = useState<CameraType>(CameraType.back);
  const [capturedPhoto, setCapturedPhoto] = useState<CameraCapturedPicture | null>(null);

  const handleCapture = async () => {
    if (!camera) return;

    const photo = await takePhoto(camera);
    setCanPreviewPhoto(true);
    setCapturedPhoto(photo);
  };

  const handleRetake = () => {
    setCanPreviewPhoto(false);
    setCapturedPhoto(null);
  };

  const handleSavePhoto = () => {
    console.warn("Saving Photo", capturedPhoto);

    setCanPreviewPhoto(false);
    setCapturedPhoto(null);
  };

  //onMounted
  useEffect(() => {
    const permission = getPermission();
    if (!permission) {
      Alert.alert("Access denied");
    } else {
      setCanRunCamera(true);
    }
  }, []);

  return (
    <>
      {canRunCamera && !canPreviewPhoto && (
        <Camera
          type={cameraType}
          style={styles.camera}
          ref={(ref) => {
            camera = ref;
          }}
        >
          <CameraControlSpace onCapture={handleCapture} />
        </Camera>
      )}

      {canPreviewPhoto && capturedPhoto && (
        <CameraPreview photo={capturedPhoto} onRetake={handleRetake} onSavePhoto={handleSavePhoto} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  camera: {
    width: "100%",
    height: "100%",
  },
});
export default AppCamera;

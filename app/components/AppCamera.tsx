import React, { useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { Camera, CameraCapturedPicture } from "expo-camera";
import { CameraType } from "expo-camera/build/Camera.types";

import CameraControlSpace from "./CameraControlSpace";
import CameraPreview from "./CameraPreview";

const AppCamera: React.FC = () => {
  let camera: Camera | null;

  const [canRunCamera, setCanRunCamera] = useState<boolean>(false);
  const [canPreviewPhoto, setCanPreviewPhoto] = useState<boolean>(false);

  const [cameraType, setCameraType] = useState<CameraType>(CameraType.back);
  const [capturedPhoto, setCapturedPhoto] = useState<CameraCapturedPicture | null>(null);

  const handleCapture = async () => {
    if (!camera) return;

    const photo = await __takePhoto(camera);
    setCanPreviewPhoto(true);
    setCapturedPhoto(photo);
  };

  const __getPermission = async (): Promise<boolean> => {
    const { status } = await Camera.requestPermissionsAsync();
    return status === "granted";
  };

  const __takePhoto = async (camera: Camera): Promise<CameraCapturedPicture> => {
    const photo = await camera.takePictureAsync();
    return photo;
  };

  const __resetCamera = (): void => {
    setCanPreviewPhoto(false);
    setCapturedPhoto(null);
  };

  const handleRetake = (): void => {
    __resetCamera();
  };

  const handleSavePhoto = (): void => {
    console.warn("Saving Photo", capturedPhoto);
    __resetCamera();
  };

  //onMounted
  useEffect(() => {
    const permission = __getPermission();
    if (!permission) {
      Alert.alert("Access denied");
    } else {
      setCanRunCamera(true);
      __resetCamera();
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
    overflow: "hidden",
  },
});
export default AppCamera;

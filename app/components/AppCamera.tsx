import React, { useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { Camera, CameraCapturedPicture } from "expo-camera";
import { CameraType } from "expo-camera/build/Camera.types";

const getPermission = async () => {
  const { status } = await Camera.requestPermissionsAsync();
  return status === "granted";
};

const AppCamera: React.FC = () => {
  let camera: Camera | null;

  const [canRunCamera, setCanRunCamera] = useState<boolean>(false);
  const [cameraType, setCameraType] = useState<CameraType>(CameraType.back);
  const [capturedPhoto, setCapturedPhoto] = useState<CameraCapturedPicture | null>(null);

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
      {canRunCamera && (
        <Camera
          type={cameraType}
          style={styles.container}
          ref={(ref) => {
            camera = ref;
          }}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
});
export default AppCamera;

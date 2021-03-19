import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import * as tf from "@tensorflow/tfjs";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";

import GLCamera from "../components/camera/GLCamera";
import CameraControlSpace from "../components/camera/CameraControlSpace";
import CameraPreview from "../components/preview/CameraPreview";
import PreviewControlSpace from "../components/preview/PreviewControlSpace";
import ImageScrollRoll from "../components/camera/ImageScrollRoll";

import {PredictModel,PoseModel,CocoModel} from "../tools"

import { getPredictImages, getImagePose } from "../api/http";
import tryCatch from "../helpers/error-handler"
import BoxResult from "../components/pose/BoxResult";
import PoseResult from "../components/pose/PoseResult";

function CameraScreen(props) {
  let glCamera = useRef(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    await tf.ready();
    console.warn("tf - ready");
    setPredictModel(new PredictModel());
    setPoseModel(new PoseModel());
    setCocoModel(new CocoModel());
  };
  const [predictModel, setPredictModel] = useState(null);
  const [poseModel, setPoseModel] = useState(null);
  const [cocoModel, setCocoModel] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [poseData, setPoseData] = useState(null);
  const [imageUrls, setImageUrls] = useState(null);
  const [box, setBox] = useState(null);

  const detectBoundingBox = tryCatch(() => {
      const imageTensor = glCamera.current.getRealTimeImage();
      const result = await cocoModel.getBoundingBox(imageTensor);
      setBox(result[0].bbox);
 })

 const detectPoseKeyPoints = tryCatch(() => {
     const imageTensor = glCamera.current.getRealTimeImage();
     const result = await poseModel.analysePose(imageTensor);
     setPoseData(result);
  
 })

 const searchForSimilarImages = tryCatch(() => {
  const tensorArray = predictModel.getImageCompressedTensorArray(imageTensor);
    const result = await getPredictImages({ features: tensorArray });
    setImageUrls(result);
 })

  const previewImage = tryCatch(async () => {
   const image = await glCamera.current.captureImage();
   setPreviewImage(image);
   setIsPreview(true);
 })

 
  const onCapture = async () => {
    setInterval(async () => {
      
    }, 300);
  };

  const onSave = () => {
    MediaLibrary.saveToLibraryAsync(previewImage.uri);
    alert("保存成功");
  };

  const onPredict = async () => {
  
  };

  const onOpenImageFolder = async () => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  };

  const onRetake = () => {
    setPreviewImage(null);
    setIsPreview(false);
  };

  const onSelectImage = async (e, imageName) => {
    const result = await getImagePose({ imageName });
    console.warn("imageName:", result);
  };

  return (
    <View style={{ flex: 1 }}>
      {!isPreview && (
        <View style={styles.container}>
          <GLCamera ref={glCamera} style={styles.camera} />
          {box && <BoxResult position={box} />}
          {poseData && <PoseResult poseData={poseData}  />}
          {imageUrls && (
            <ImageScrollRoll
              images={imageUrls}
              style={styles.imageScrollRoll}
              onSelectImage={onSelectImage}
            />
          )}
          <CameraControlSpace
            onCapture={onCapture}
            onOpenImageFolder={onOpenImageFolder}
            onPredict={onPredict}
          />
        </View>
      )}
      {isPreview && (
        <View style={styles.container}>
          <CameraPreview image={previewImage} />
          <PreviewControlSpace onSave={onSave} onRetake={onRetake} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    position: "relative",
  },
  imageScrollRoll: {
    position: "absolute",
    bottom: "17%",
  },
});

export default CameraScreen;
//<CameraControlSpace onCapture={onCapture} style={styles.space} />

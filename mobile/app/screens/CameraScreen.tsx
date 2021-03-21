import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import * as tf from "@tensorflow/tfjs";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";

import GLCamera from "../components/camera/GLCamera";
import CameraControlSpace from "../components/camera/CameraControlSpace";
import CameraPreview from "../components/preview/CameraPreview";
import PreviewControlSpace from "../components/preview/PreviewControlSpace";
import ImageScrollRoll from "../components/camera/ImageScrollRoll";

import PredictModel from "../tools/PredictModel";
import PoseModel from "../tools/PoseModel";
import CocoModel from "../tools/CocoModel";

import { getPredictImages, getImagePose } from "../api/http";
import tryCatch from "../helpers/error-handler";
import BoxResult from "../components/pose/BoxResult";
import PoseResult from "../components/pose/PoseResult";
import colors from "../config/colors";

import { Tensor3D } from "@tensorflow/tfjs";
import {
  DetectMode,
  Dimensions2D,
  PoseData,
  PoseResponse,
  PredictedImage,
  BoxPosition,
} from "../types";
import BoundingBox from "../components/pose/BoundingBox";

function CameraScreen() {
  let glCamera = useRef(null!);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      await tf.ready();
      console.warn("tf - ready");
      // setPredictModel(new PredictModel());
      // setPoseModel(new PoseModel());
      setCocoModel(new CocoModel());
    } catch (error) {
      console.error(error);
    }
  };

  const [predictModel, setPredictModel] = useState<PredictModel>(null!);
  const [poseModel, setPoseModel] = useState<PoseModel>(null!);
  const [cocoModel, setCocoModel] = useState<CocoModel>(null!);
  const [isPreview, setIsPreview] = useState<Boolean>(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [poseData, setPoseData] = useState<PoseData>(null);
  const [predictedImages, setPredictedImages] = useState<PredictedImage[]>(
    null
  );

  //mode: "photo" | "bounding" | "pose"
  const [mode, setMode] = useState<DetectMode>("photo");
  const [cameraTensor, setCameraTensor] = useState<tf.Tensor3D>(null!);
  const [similarImage, setSimilarImage] = useState({
    width: 1000,
    height: 1000,
    x1: 300,
    y1: 300,
    x2: 600,
    y2: 600,
  });

  const onCapture =  () => {
    console.warn('1111')


    const result = glCamera.current.getRealTimeImage()
    setCameraTensor(result)

    // setMode('bounding')

    
    
  };

  const onOpenImageFolder = () => {
    console.warn("o");
  };
  const onPredict = () => {
    console.warn("p");
  };

  return (
    <View style={{ flex: 1 }}>
      {!isPreview && (
        <View style={styles.container}>
          <GLCamera ref={glCamera} />

          <CameraControlSpace
            onCapture={onCapture}
            onOpenImageFolder={onOpenImageFolder}
            onPredict={onPredict}
          />

          {mode === "bounding" && cocoModel && cameraTensor &&(
            <BoundingBox
              userTensor={cameraTensor}
              similarImage={similarImage}
            />
          )}
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

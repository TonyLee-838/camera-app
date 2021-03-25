import React, { useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import * as tf from "@tensorflow/tfjs";

import Pose from "../components/pose/Pose";
import BoundingBox from "../components/pose/BoundingBox";
import {
  GLCamera,
  CameraControlSpace,
  ImageScrollRoll,
} from "../components/camera/index";
import { CameraPreview, PreviewControlSpace } from "../components/preview";
import { getPredictImages, getImagePose } from "../api/http";
import Suggestion from "../components/common/Suggestion";
import Step from "../components/common/Step";

import { Tensor3D } from "@tensorflow/tfjs";
import {
  DetectMode,
  PoseData,
  PoseResponse,
  PredictedImage,
  StepTypes,
  Models,
  BoxData,
} from "../types";

interface CameraScreenProps {
  models: Models;
}

function CameraScreen({ models }: CameraScreenProps) {
  let glCamera = useRef(null!);

  const [isPreview, setIsPreview] = useState<Boolean>(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [predictedImages, setPredictedImages] = useState<PredictedImage[]>(
    null
  );

  const [mode, setMode] = useState<DetectMode>("photo");
  const [step, setStep] = useState<StepTypes | null>(null);

  const [userBox, setUserBox] = useState<BoxData>(null!);
  const [similarImageBox, setSimilarImageBox] = useState<BoxData>(null!);

  const [userPose, setUserPose] = useState<PoseData>(null);
  const [similarImagePose, setSimilarImagePose] = useState<PoseData>(null);

  const [suggestion, setSuggestion] = useState<string>("");

  const searchForSimilarImages = async () => {
    try {
      const imageTensor: Tensor3D = glCamera.current.getRealTimeImage();

      const tensorArray: number[] = models.predictModel.getImageCompressedTensorArray(
        imageTensor
      );

      const result: PredictedImage[] = await getPredictImages({
        features: tensorArray,
      });

      setPredictedImages(result);

      imageTensor.dispose();
    } catch (error) {
      console.error(error);
    }
  };

  const onCapture = async () => {
    setStep(null);
    const image = await glCamera.current.captureImage();
    setIsPreview(true);
    setPreviewImage(image);
  };

  const onOpenImageFolder = () => {
    ImagePicker.launchImageLibraryAsync();
  };

  const onSelectImage = async (e, imageName) => {
    setPredictedImages(null);

    const { image, parts }: PoseResponse = await getImagePose({ imageName });

    const dimensions = {
      width: image.width,
      height: image.height,
    };
    // setSimilarImageBox({
    //   position: [image.x1, image.y1, image.x2, image.y2],
    //   dimensions,
    // });

    const keypoints = parts.map((part) => ({
      position: {
        x: part.x,
        y: part.y,
      },
      part: part.label,
      score: 1,
    }));

    setSimilarImagePose({
      dimensions,
      keypoints,
    });

    await refreshUserBox();
    setMode("bounding");
    setStep("adjustDistance");
  };

  const handleBoxFulfilled = async () => {
    await refreshUserPose();

    setSuggestion("完美!");

    setMode("pose");
    setStep("adjustPose");

    setUserBox(null);
    setSimilarImageBox(null);
  };

  const handlePoseFulfilled = () => {
    setMode("photo");
    setStep("goodToGo");

    setUserPose(null);
    setSimilarImagePose(null);

    setSuggestion("完美！可以拍照了");
  };

  const getCameraImageTensor = () => {
    return tf.tidy(() => {
      return glCamera.current.getRealTimeImage();
    });
  };

  const refreshUserPose = async () => {
    const tensor = getCameraImageTensor();

    const pose = await models.poseModel.analysePose(tensor);
    setUserPose(pose);

    tensor.dispose();
  };

  const refreshUserBox = async () => {
    const tensor = getCameraImageTensor();

    const box = await models.cocoModel.getBoundingBox(tensor);
    setUserBox(box);

    tensor.dispose();
  };

  const onPredict = async () => {
    await searchForSimilarImages();
    setStep("selectImage");
  };

  const onRetake = () => {
    setIsPreview(false);
    setPreviewImage(null);
    setMode("photo");
  };

  const onSave = () => {
    MediaLibrary.saveToLibraryAsync(previewImage.uri);
    setSuggestion("保存成功!");
  };

  return (
    <View style={{ flex: 1 }}>
      {step && <Step currentStep={step} />}
      <Suggestion content={suggestion} />
      {!isPreview && (
        <View style={styles.container}>
          <GLCamera ref={glCamera} />
          {mode === "bounding" && similarImageBox && userBox && (
            <BoundingBox
              userBox={userBox}
              similarImageBox={similarImageBox}
              onNextFrame={refreshUserBox}
              onFulfill={handleBoxFulfilled}
              onUserStatusChange={setSuggestion}
            />
          )}
          {mode === "pose" && userPose && similarImagePose && (
            <Pose
              userPose={userPose}
              imagePose={similarImagePose}
              onNextFrame={refreshUserPose}
              onFulfill={handlePoseFulfilled}
              onUserStatusChange={setSuggestion}
            />
          )}
          {predictedImages && (
            <ImageScrollRoll
              images={predictedImages}
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
          <PreviewControlSpace onRetake={onRetake} onSave={onSave} />
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

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

function CameraScreen(props) {
  let glCamera = useRef(null);

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

  const [predictModel, setPredictModel] = useState(null);
  const [poseModel, setPoseModel] = useState(null);
  const [cocoModel, setCocoModel] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [poseData, setPoseData] = useState(null);
  const [imageUrls, setImageUrls] = useState(null);
  const [userBox, setUserBox] = useState([]);

  //mode: "photo" | "bounding" | "pose"
  const [mode, setMode] = useState("photo");
  const [similarImageBox, setSimilarImageBox] = useState([]);
  const [similarImageDimensions, setSimilarImageDimensions] = useState([]);

  useEffect(() => {
    if (mode === "photo") return;

    setInterval(async () => {
      if (mode === "bounding") await detectBoundingBox();
      if (mode === "pose") await detectPoseKeyPoints();
    }, 1000);
  }, [mode]);

  const detectBoundingBox = tryCatch(async () => {
    const imageTensor = glCamera.current.getRealTimeImage();
    const result = await cocoModel.getBoundingBox(imageTensor);
    console.warn('result[0].bbox',result[0].bbox)
    setUserBox(result[0].bbox);
    setMode('bounding')
  });

  const detectPoseKeyPoints = tryCatch(async () => {
    if (!poseModel) return;

    const imageTensor = glCamera.current.getRealTimeImage();
    const result = await poseModel.analysePose(imageTensor);
    setPoseData(result);
  });

  const searchForSimilarImages = async () => {
    try {
      const imageTensor = glCamera.current.getRealTimeImage();
      const tensorArray = predictModel.getImageCompressedTensorArray(imageTensor);
      const result = await getPredictImages({ features: tensorArray });
      setImageUrls(result);
    } catch (error) {
      console.error(error);
    }
  };

  const preview = tryCatch(async () => {
    const image = await glCamera.current.captureImage();
    setPreviewImage(image);
    setIsPreview(true);
  });

  const onCapture = async () => {
    // setInterval(async () => {
    //   await detectPoseKeyPoints();
    // }, 300);
    const imageTensor = glCamera.current.getRealTimeImage();
    const result = await cocoModel.getBoundingBox(imageTensor);
    console.warn(result)
    setUserBox(result[0].bbox);
    setMode("bounding");
  };

  const onSave = () => {
    MediaLibrary.saveToLibraryAsync(previewImage.uri);
    alert("保存成功");
  };

  const onPredict = async () => {
    const { image } = await getImagePose({ imageName:'10379.jpg' });
    // console.warn("imageName:", image);

    setSimilarImageBox([image.x1, image.y1, image.x2, image.y2 ]);
    setSimilarImageDimensions({ width: image.width, height: image.height });
    setMode("bounding");
  };

  const onOpenImageFolder = async () => {
    // ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.All,
    //   allowsEditing: true,
    //   aspect: [4, 3],
    //   quality: 1,
    // });
    const { image } = await getImagePose({ imageName:'10560.jpg' });
    // console.warn("imageName:", image);
    console.warn('image',image)

    setSimilarImageBox([image.x1, image.y1, image.x2 , image.y2]);
    setSimilarImageDimensions({ width: image.width, height: image.height });

    detectBoundingBox()
    // onSelectImage()
    //setMode('bounding')
  };

  const onRetake = () => {
    setPreviewImage(null);
    setIsPreview(false);
  };

  const onSelectImage = async () => {
    const { image } = await getImagePose({ imageName:'10379.jpg' });
    // console.warn("imageName:", image);

    setSimilarImageBox([image.x1, image.y1, image.x2 , image.y2]);
    setSimilarImageDimensions({ width: image.width, height: image.height });

    // setMode("bounding");
    // setImageUrls(null);
  };

  return (
    <View style={{ flex: 1 }}>
      {!isPreview && (
        <View style={styles.container}>
          <GLCamera ref={glCamera} style={styles.camera} />
          {mode === "bounding" && userBox.length !== 0 && (
            <BoxResult position={userBox} color={colors.primary} />
          )}
          {mode === "bounding" && similarImageBox.length!==0&&(
            <BoxResult
              position={similarImageBox}
              imageDimensions={similarImageDimensions}
              color={colors.secondary}
            />
          )}

          {poseData && <PoseResult poseData={poseData} />}
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
  image: {
    position: "absolute",
    width: 30,
    height: 30,
    zIndex: 10,
  },
});

export default CameraScreen;
//<CameraControlSpace onCapture={onCapture} style={styles.space} />

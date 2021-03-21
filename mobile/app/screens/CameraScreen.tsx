import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';

import Pose from '../components/pose/Pose';
import { GLCamera, CameraControlSpace, ImageScrollRoll } from '../components/camera';
import { CameraPreview, PreviewControlSpace } from '../components/preview';
import { PredictModel, PoseModel, CocoModel } from '../models';
import { getPredictImages, getImagePose } from '../api/http';
import tryCatch from '../helpers/error-handler';

import { Tensor3D } from '@tensorflow/tfjs';
import { DetectMode, Dimensions2D, PoseData, PoseResponse, PredictedImage, BoxPosition } from '../types';

function CameraScreen() {
  let glCamera = useRef(null!);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      await tf.ready();
      console.warn('tf - ready');
      setPredictModel(new PredictModel());
      setPoseModel(new PoseModel());
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
  const [predictedImages, setPredictedImages] = useState<PredictedImage[]>(null);

  //mode: "photo" | "bounding" | "pose"
  const [mode, setMode] = useState<DetectMode>('photo');

  const [userBox, setUserBox] = useState<BoxPosition>([]);
  const [similarImageBox, setSimilarImageBox] = useState<BoxPosition>(null!);
  const [similarImageDimensions, setSimilarImageDimensions] = useState<Dimensions2D>(null);

  const [userPose, setUserPose] = useState<PoseData>(null);
  const [similarImagePose, setSimilarImagePose] = useState<PoseData>(null);

  useEffect(() => {
    if (mode === 'photo') return;

    setInterval(async () => {
      if (mode === 'bounding') await detectBoundingBox();
      // if (mode === 'pose') await detectPoseKeyPoints();
    }, 500);
  }, [mode]);

  const detectBoundingBox = tryCatch(async () => {
    const imageTensor: Tensor3D = glCamera.current.getRealTimeImage();
    const result = await cocoModel.getBoundingBox(imageTensor);
    setUserBox(result[0].bbox);

    imageTensor.dispose();
  });

  // const detectPoseKeyPoints = async () => {
  //   try {
  //     // if (!poseModel) return;

  //     const imageTensor: Tensor3D = glCamera.current.getRealTimeImage();
  //     const result = await poseModel.analysePose(imageTensor);
  //     setPoseData(result);

  //     imageTensor.dispose();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const searchForSimilarImages = async () => {
    try {
      const imageTensor: Tensor3D = glCamera.current.getRealTimeImage();
      const tensorArray: number[] = predictModel.getImageCompressedTensorArray(imageTensor);
      const result: PredictedImage[] = await getPredictImages({ features: tensorArray });
      setPredictedImages(result);

      imageTensor.dispose();
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
    // console.warn('tt');
    setMode('pose');
    // setInterval(async () => {
    //   // await detectPoseKeyPoints();
    // }, 300);
  };

  const onSave = () => {
    MediaLibrary.saveToLibraryAsync(previewImage.uri);
    // alert("保存成功");
  };

  const onPredict = async () => {
    await searchForSimilarImages();
    // await detectBoundingBox();
    // await detectPoseKeyPoints();
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
    const { image, parts }: PoseResponse = await getImagePose({ imageName });

    setSimilarImageBox([image.x1, image.y1, image.x2 - image.x1, image.y2 - image.y1]);
    setSimilarImageDimensions({ width: image.width, height: image.height });

    const keypoints = parts.map((part) => ({
      position: {
        x: part.x,
        y: part.y,
      },
      part: part.label,
      score: 1,
    }));

    setSimilarImagePose({
      width: image.width,
      height: image.height,
      keypoints,
    });

    // setMode("bounding");
    await refreshUserPose();
    setMode('pose');
    setPredictedImages(null);
  };

  const getCameraImageTensor = () => {
    return tf.tidy(() => {
      return glCamera.current.getRealTimeImage();
    });
  };

  const refreshUserPose = async () => {
    const tensor = getCameraImageTensor();
    const pose = await poseModel.analysePose(tensor);
    setUserPose(pose);

    tensor.dispose();
  };
  return (
    <View style={{ flex: 1 }}>
      {!isPreview && (
        <View style={styles.container}>
          <GLCamera ref={glCamera} />
          {/* {mode === 'bounding' && userBox && <BoxResult position={userBox} color={colors.primary} />}
          {mode === 'bounding' && (
            <BoxResult
              position={similarImageBox}
              imageDimensions={similarImageDimensions}
              color={colors.secondary}
            />
          )} */}
          {mode === 'pose' && (
            <Pose
              userPose={userPose}
              imagePose={similarImagePose}
              onNextFrame={refreshUserPose}
              onFulfill={() => {}}
            />
          )}
          {/* {mode === 'pose' && poseData && (
            <PoseResult poseData={poseData} color={colors.primary} target='user' />
          )}
          {mode === 'pose' && (
            <PoseResult poseData={similarImagePose} color={colors.secondary} target='image' />
          )} */}
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
          <PreviewControlSpace onSave={onSave} onRetake={onRetake} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    position: 'relative',
  },
  imageScrollRoll: {
    position: 'absolute',
    bottom: '17%',
  },
});

export default CameraScreen;
//<CameraControlSpace onCapture={onCapture} style={styles.space} />

import React, { useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import * as tf from '@tensorflow/tfjs';

import Pose from '../components/pose/Pose';
import BoundingBox from '../components/pose/BoundingBox';
import { GLCamera, CameraControlSpace, ImageScrollRoll } from '../components/camera/index';
import { CameraPreview, PreviewControlSpace } from '../components/preview';
import { getPredictImages, getImagePose } from '../api/http';
import { regulateBoxFromCocoModel } from '../helpers/boxTools';
import Tip from '../components/common/Tip';
import Step from '../components/common/Step';

import { Tensor3D } from '@tensorflow/tfjs';
import {
  DetectMode,
  PoseData,
  PoseResponse,
  PredictedImage,
  BoxPosition,
  SimilarImage,
  StepTypes,
} from '../types';
import { useModels } from '../hooks/useModels';

function CameraScreen({ models }) {
  let glCamera = useRef(null!);

  // const {predictModel, poseModel, cocoModel} = useModels()

  const [isPreview, setIsPreview] = useState<Boolean>(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [predictedImages, setPredictedImages] = useState<PredictedImage[]>(null);

  const [mode, setMode] = useState<DetectMode>('photo');
  const [step, setStep] = useState<StepTypes | null>(null);

  const [userBox, setUserBox] = useState<BoxPosition>(null!);
  const [similarImage, setSimilarImage] = useState<SimilarImage>(null!);

  const [userPose, setUserPose] = useState<PoseData>(null);
  const [similarImagePose, setSimilarImagePose] = useState<PoseData>(null);

  const [tipText, setTipText] = useState<string>('');

  const searchForSimilarImages = async () => {
    try {
      const imageTensor: Tensor3D = glCamera.current.getRealTimeImage();

      const tensorArray: number[] = models.predictModel.getImageCompressedTensorArray(imageTensor);

      const result: PredictedImage[] = await getPredictImages({ features: tensorArray });

      setPredictedImages(result);

      imageTensor.dispose();
    } catch (error) {
      console.error(error);
    }
  };

  const onCapture = async () => {
    setStep(null);
    setTipText('');
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
    setSimilarImage(image);

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

    await refreshUserBox();
    setMode('bounding');
    setStep('adjustDistance');
  };

  const handleBoxFulfilled = async () => {
    await refreshUserPose();

    setTipText('完美!');
    setTimeout(() => {
      setTipText('');
    }, 1500);

    setMode('pose');
    setStep('adjustPose');
    setUserBox(null);
    setSimilarImage(null);
  };

  const handlePoseFulfilled = () => {
    setMode('photo');
    setStep('goodToGo');
    setUserPose(null);
    setSimilarImagePose(null);

    setTipText('完美！可以拍照了');
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
    const result = await models.cocoModel.getBoundingBox(tensor);
    const box = regulateBoxFromCocoModel(result);
    setUserBox(box);

    tensor.dispose();
  };

  const onPredict = async () => {
    await searchForSimilarImages();
    setStep('selectImage');
  };

  const onRetake = () => {
    setIsPreview(false);
    setPreviewImage(null);
    setMode('photo');
  };

  const onSave = () => {
    MediaLibrary.saveToLibraryAsync(previewImage.uri);
    setTipText('保存成功!');
  };

  return (
    <View style={{ flex: 1 }}>
      {step && <Step currentStep={step} />}
      <Tip text={tipText} />
      {!isPreview && (
        <View style={styles.container}>
          <GLCamera ref={glCamera} />
          {mode === 'bounding' && similarImage && userBox && (
            <BoundingBox
              userBox={userBox}
              similarImage={similarImage}
              onNextFrame={refreshUserBox}
              onFulfill={handleBoxFulfilled}
            />
          )}
          {mode === 'pose' && userPose && similarImagePose && (
            <Pose
              userPose={userPose}
              imagePose={similarImagePose}
              onNextFrame={refreshUserPose}
              onFulfill={handlePoseFulfilled}
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
    flexDirection: 'column',
    position: 'relative',
  },
  imageScrollRoll: {
    position: 'absolute',
    bottom: '17%',
  },
});

export default CameraScreen;

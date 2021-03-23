import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';

import Pose from '../components/pose/Pose';
import BoundingBox from '../components/pose/BoundingBox'
import { GLCamera, CameraControlSpace, ImageScrollRoll } from '../components/camera/index';
import { CameraPreview, PreviewControlSpace } from '../components/preview';
import { PredictModel, PoseModel, CocoModel } from '../models';
import { getPredictImages, getImagePose } from '../api/http';
import tryCatch from '../helpers/error-handler';
import { regulateBoxFromCocoModel } from '../helpers/boxTools'
import Tip  from '../components/common/Tip'

import { Tensor3D } from '@tensorflow/tfjs';
import { DetectMode, Dimensions2D, PoseData, PoseResponse, PredictedImage, BoxPosition, SimilarImage } from '../types';

function CameraScreen() {

  let glCamera = useRef(null!);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      await tf.ready();
      console.warn('tf - ready');
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
  const [predictedImages, setPredictedImages] = useState<PredictedImage[]>(null);

  //mode: "photo" | "bounding" | "pose"
  const [mode, setMode] = useState<DetectMode>('photo');

  const [userBox, setUserBox] = useState<BoxPosition>(null!);
  const [similarImage, setSimilarImage] = useState<SimilarImage>(null!)

  const [userPose, setUserPose] = useState<PoseData>(null);
  const [similarImagePose, setSimilarImagePose] = useState<PoseData>(null);


  const detectBoundingBox = tryCatch(async () => {
    const imageTensor: Tensor3D = glCamera.current.getRealTimeImage();
    const result = await cocoModel.getBoundingBox(imageTensor);
    const box = regulateBoxFromCocoModel(result)
    console.warn(box)
    setUserBox(box);

    imageTensor.dispose();
  });

  const onCapture = async () => {
    await onSelectImage()
    await refreshUserBox()
    setMode('bounding')
  };

  const onOpenImageFolder = () => {
    setMode('photo')
  };

  const onSelectImage = async () => {
    const { image, parts }: PoseResponse = await getImagePose({ imageName: '1' });
    setSimilarImage(image)
    
    // const keypoints = parts.map((part) => ({
    //   position: {
    //     x: part.x,
    //     y: part.y,
    //   },
    //   part: part.label,
    //   score: 1,
    // }));

    // setSimilarImagePose({
    //   width: image.width,
    //   height: image.height,
    //   keypoints,
    // });

    // await refreshUserPose();
    // setMode('pose');
    // setPredictedImages(null);
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

  const refreshUserBox = async()=>{
    const tensor = getCameraImageTensor();
    const result = await cocoModel.getBoundingBox(tensor);
    const box = regulateBoxFromCocoModel(result)
    setUserBox(box);
    
    tensor.dispose();
  }

  const onPredict = ()=>{
    refreshUserBox()
  }

  const [tipText,setTipText] = useState()
  const onShowTip= (str)=>{
    setTipText(str)
  }


  return (
    <View style={{ flex: 1 }}>
      {!isPreview && (
        <View style={styles.container}>
          <Tip text={tipText} />
          <GLCamera ref={glCamera} />
          {mode === 'pose' && (
            <Pose
              userPose={userPose}
              imagePose={similarImagePose}
              onNextFrame={refreshUserPose}
              onFulfill={()=>{}}
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

          {mode === "bounding" && similarImage && userBox &&(
            <BoundingBox
              userBox={userBox}
              similarImage={similarImage}
              onNextFrame={refreshUserBox}
              onFulfill={(s) => onShowTip(s)}
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

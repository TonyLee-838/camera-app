import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';

import GLCamera from '../components/camera/GLCamera';
import CameraControlSpace from '../components/camera/CameraControlSpace';
import CameraPreview from '../components/preview/CameraPreview';
import PreviewControlSpace from '../components/preview/PreviewControlSpace';
import ImageScrollRoll from '../components/camera/ImageScrollRoll';

import PredictModel from '../tools/PredictModel';
import PoseModel from '../tools/PoseModel';
import CocoModel from '../tools/CocoModel';

import { getPredictImages, getImagePose } from '../api/http';
import tryCatch from '../helpers/error-handler';
import BoxResult from '../components/pose/BoxResult';
import PoseResult from '../components/pose/PoseResult';
import colors from '../config/colors';

import { Tensor3D } from '@tensorflow/tfjs';
import { DetectMode, Dimensions2D, PoseData, PoseResponse, PredictedImage, BoxPosition,SimilarImage } from '../types';
import Pose from '../components/pose/Pose';
import BoundingBox from '../components/pose/BoundingBox'
import { regulateBoxFromCocoModel } from '../helpers/boxTools'

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

  const [userBox, setUserBox] = useState<BoxPosition>([]);
  const [similarImage, setSimilarImage] = useState<SimilarImage>(null!)

  const [userPose, setUserPose] = useState<PoseData>(null);
  const [similarImagePose, setSimilarImagePose] = useState<PoseData>(null);

 

  // useEffect(() => {
  //   if (mode === 'photo') return;

  //   setInterval(async () => {
  //     if (mode === 'bounding') await detectBoundingBox();
  //     // if (mode === 'pose') await detectPoseKeyPoints();
  //   }, 500);
  // }, [mode]);

  const detectBoundingBox = tryCatch(async () => {
    const imageTensor: Tensor3D = glCamera.current.getRealTimeImage();
    const result = await cocoModel.getBoundingBox(imageTensor);
    const box = regulateBoxFromCocoModel(result)
    console.warn(box)
    setUserBox(box);

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

 

    // setMode('bounding')

  const onCapture = async () => {
    await onSelectImage()
    await refreshUserBox()
    setMode('bounding')
  };

  const onOpenImageFolder = () => {
    setMode('photo')
  };

  const onSelectImage = async () => {
    //const { image, parts }: PoseResponse = await getImagePose({ imageName:'1' });
    setSimilarImage({width:500,height:1200,x1:100,y1:300,x2:200,y2:666})

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

    // // setMode("bounding");
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
  return (
    <View style={{ flex: 1 }}>
      {!isPreview && (
        <View style={styles.container}>
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

          {mode === "bounding" && cocoModel &&(
            <BoundingBox
              userBox={userBox}
              similarImage={similarImage}
              onNextFrame={refreshUserBox}
              onFulfill={(s) => {console.warn(s);}}
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

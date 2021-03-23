import React, { useEffect, useState } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";

import BoxResult from "./BoxResult";
import {
  Dimensions2D,
  BoxPosition,
  SimilarImage,
  regulatedBox,
  UserStatus
} from "../../types";
import colors from "../../config/colors";
import {
  regulateImageBoxPosition,
  regulateUserBoxPosition,
} from "../../helpers/regulatePosition";
import { inferUserStatus } from '../../helpers/boxTools'
import Tip from '../common/Tip'
import axios from "axios";

const COCO_INPUT_WIDTH = 750;
const COCO_INPUT_HEIGHT = 1500;

let regulatedImagePosition: regulatedBox;
let regulatedUserPosition: regulatedBox;

interface BoundingBoxProps {
  userBox: BoxPosition;
  similarImage: SimilarImage;
  onNextFrame: () => Promise<void>;
  onFulfill: () => void;
}

function BoundingBox({
  userBox,
  similarImage,
  onNextFrame,
  onFulfill,
}: BoundingBoxProps) {
  const deviceDimensions: Dimensions2D = useWindowDimensions();
  const [tipText,setTipText] = useState()
  const [similarImageBox, setSimilarImageBox] = useState<BoxPosition>([
    similarImage.x1,
    similarImage.y1,
    similarImage.x2,
    similarImage.y2,
  ]);

  const userDimensions: Dimensions2D = {
    width: COCO_INPUT_WIDTH,
    height: COCO_INPUT_HEIGHT,
  };
  const [
    similarImageDimensions,
    setSimilarImageDimensions,
  ] = useState<Dimensions2D>({
    width: similarImage.width,
    height: similarImage.height,
  });

  regulatedImagePosition = regulateImageBoxPosition(
    similarImageBox,
    similarImageDimensions,
    deviceDimensions
  );

  regulatedUserPosition = regulateUserBoxPosition(
    userBox,
    userDimensions,
    deviceDimensions
  );


  const getUserStatus = () => {
    const result = inferUserStatus(regulatedUserPosition,regulatedImagePosition)
    return result
  };


  const onShowTip= (str)=>{
    setTipText(str)
  }

  useEffect(() => {
    setInterval(async () => {
      await onNextFrame();
      const status = getUserStatus()
      onShowTip(status)
      if(status==='fine') onFulfill()
    }, 500);
  }, []);



  return (
    <View style={styles.container}>
      <Tip text={tipText} />
      {userBox && (
        <BoxResult position={regulatedUserPosition} color={colors.primary} />
      )}
      {similarImageBox && (
        <BoxResult position={regulatedImagePosition} color={colors.secondary} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});

export default BoundingBox;

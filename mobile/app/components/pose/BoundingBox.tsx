import React, { useEffect, useState } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";

import BoxResult from "./BoxResult";
import {
  Dimensions2D,
  BoxPosition,
  SimilarImage,
  regulatedBox,
} from "../../types";
import colors from "../../config/colors";
import {
  regulateImageBoxPosition,
  regulateUserBoxPosition,
} from "../../helpers/regulatePosition";
import { inferUserState } from '../../helpers/boxTools'
import axios from "axios";

const COCO_INPUT_WIDTH = 750;
const COCO_INPUT_HEIGHT = 1500;
const THRESHOLD = 35;

let regulatedImagePosition: regulatedBox;
let regulatedUserPosition: regulatedBox;

interface BoundingBoxProps {
  userBox: BoxPosition;
  similarImage: SimilarImage;
  onNextFrame: () => Promise<void>;
  onFulfill: (x: string) => void;
}

function BoundingBox({
  userBox,
  similarImage,
  onNextFrame,
  onFulfill,
}: BoundingBoxProps) {
  const deviceDimensions: Dimensions2D = useWindowDimensions();

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


  const isFullfill = () => {
    const result = inferUserState(regulatedUserPosition,regulatedImagePosition,THRESHOLD)
    // axios.post('http://10.139.77.247:3003/debug',{result})
    return result
  };

  useEffect(() => {
    setInterval(async () => {
      await onNextFrame();
      onFulfill(isFullfill())
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
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

import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import * as tf from "@tensorflow/tfjs";

import { Dimensions2D, BoxPosition } from "../../types";
import CocoModel from "../../tools/CocoModel";
import BoxResult from "./BoxResult";
import colors from "../../config/colors";

const COCO_INPUT_WIDTH = 750;
const COCO_INPUT_HEIGHT = 1500;

interface SimilarImage {
  width: number;
  height: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface BoundingBoxProps {
  userBox: BoxPosition;
  similarImage: SimilarImage;
  onNextFrame?: () => void;
  onFullfill?: () => void;
}

function BoundingBox({
  userBox,
  similarImage,
  onNextFrame,
  onFullfill,
}: BoundingBoxProps) {
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


  return (
    <View style={styles.container}>
      {userBox && (
        <BoxResult
          position={userBox}
          color={colors.primary}
          dimensions={userDimensions}
          target="user"
        />
      )}
      {/* {similarImageBox && (
        <BoxResult
          position={similarImageBox}
          color={colors.secondary}
          dimensions={similarImageDimensions}
          target="image"
        />
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '80%',
  },
});

export default BoundingBox;

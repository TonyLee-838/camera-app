import React from "react";
import { View, StyleSheet } from "react-native";

import KeyPoint from "./KeyPoint";
import colors from "../../config/colors";
import { CheckProgress } from "../../types";

const group = (data) => {
  return Object.keys(data).reduce(
    (prev, key) => {
      if (key.match(/nose|eye|ear/i)) {
        prev.head.push(data[key]);
      } else if (key.match(/ankle|knee|hip/i)) {
        prev.legs.push(data[key]);
      } else {
        prev.arms.push(data[key]);
      }
      return prev;
    },
    {
      arms: [],
      legs: [],
      head: [],
    }
  );
};

interface UserPointsProps {
  userPointMap: any;
  checkProgress: CheckProgress;
}

const UserPoints = ({ userPointMap, checkProgress }: UserPointsProps) => {
  const grouped = group(userPointMap);
  const drawPoints = () => {
    return grouped[checkProgress].map((part, i) => {
      return (
        <KeyPoint
          position={part.position}
          key={`user-${i}`}
          color={colors.black}
          transparent
          radius={8}
        />
      );
    });
  };
  return <View style={styles.container}>{drawPoints()}</View>;
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 5,
  },
});

export default UserPoints;

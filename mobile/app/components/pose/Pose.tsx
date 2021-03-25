import React, { useEffect, useState } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import ImagePoints from "./ImagePoints";
import UserPoints from "./UserPoints";
import Lines from "./Lines";

import {
  getRegulatedImagePointMap,
  getRegulatedUserPointMap,
  checkParts,
} from "../../helpers/poseTools";
import { PoseData, CheckProgress } from "../../types";
import colors from "../../config/colors";

interface PoseProps {
  imagePose: PoseData;
  userPose: PoseData;
  onFulfill: () => void;
  onNextFrame: () => Promise<void>;
  onUserStatusChange: (status: string) => void;
}

const REFRESH_TIME = 1000;

function Pose({
  imagePose,
  userPose,
  onNextFrame,
  onFulfill,
  onUserStatusChange,
}: PoseProps) {
  const deviceDimensions = useWindowDimensions();

  // checkProgress代表当前正在检查的身体部位
  const [checkProgress, setCheckProgress] = useState<CheckProgress>("legs");

  //把pose转化为Keypoints，再转化为PointMap
  const imagePointMap = getRegulatedImagePointMap(imagePose, deviceDimensions);
  const userPointMap = getRegulatedUserPointMap(userPose, deviceDimensions);

  //获取当前帧的检查结果
  const checkResult = checkParts(userPointMap, imagePointMap, checkProgress);

  useEffect(() => {
    if (checkResult) {
      if (checkProgress === "legs") {
        setCheckProgress("arms");
        onUserStatusChange("checkArms");
      } else if (checkProgress === "arms") {
        setCheckProgress("head");
        onUserStatusChange("checkHead");
      } else onFulfill();
    }
  }, [userPointMap]);

  useEffect(() => {
    onUserStatusChange("checkLegs");
    const intervalId = setInterval(async () => {
      await onNextFrame();
    }, REFRESH_TIME);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.container}>
      {imagePointMap && <ImagePoints imagePointMap={imagePointMap} />}
      {imagePointMap && (
        <Lines
          pointMap={imagePointMap}
          checkProgress={checkProgress}
          color={colors.yellow}
        />
      )}

      {userPointMap && (
        <UserPoints userPointMap={userPointMap} checkProgress={checkProgress} />
      )}
      {userPointMap && (
        <Lines
          pointMap={userPointMap}
          checkProgress={checkProgress}
          color={colors.danger}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "83%",
    overflow: "hidden",
  },
});

export default Pose;

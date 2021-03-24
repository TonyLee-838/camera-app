import React, { useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';

import Box from './Box';
import colors from '../../config/colors';
import { regulateImageBoxPosition, regulateUserBoxPosition } from '../../helpers/regulatePosition';
import { inferUserStatus } from '../../helpers/boxTools';

import { Dimensions2D, UserStatus, BoxData } from '../../types';

interface BoundingBoxProps {
  userBox: BoxData;
  similarImageBox: BoxData;
  onNextFrame: () => Promise<void>;
  onFulfill: () => void;
  onUserStatusChange: (userStatus: UserStatus) => void;
}

function BoundingBox({
  userBox,
  similarImageBox,
  onNextFrame,
  onFulfill,
  onUserStatusChange,
}: BoundingBoxProps) {
  const deviceDimensions: Dimensions2D = useWindowDimensions();

  const regulatedImagePosition = regulateImageBoxPosition(
    similarImageBox.position,
    similarImageBox.dimensions,
    deviceDimensions
  );

  const regulatedUserPosition = regulateUserBoxPosition(
    userBox.position,
    userBox.dimensions,
    deviceDimensions
  );

  const userStatus = inferUserStatus(regulatedUserPosition, regulatedImagePosition);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      await onNextFrame();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    onUserStatusChange(userStatus);

    if (userStatus === 'fine') {
      onFulfill();
    }
  }, [userStatus]);

  return (
    <View style={styles.container}>
      {userBox && <Box position={regulatedUserPosition} color={colors.primary} />}
      {similarImageBox && <Box position={regulatedImagePosition} color={colors.secondary} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});

export default BoundingBox;

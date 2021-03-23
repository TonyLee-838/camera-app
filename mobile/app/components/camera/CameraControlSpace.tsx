import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import ControlSpace from '../common/ControlSpace';
import { LinearGradient } from 'expo-linear-gradient';
import IconButton from '../common/IconButton';

interface CameraControlSpaceProps {
  onCapture: ()=>void;
  onPredict: ()=>void;
  onOpenImageFolder: ()=>void;
}

function CameraControlSpace({ onCapture, onPredict, onOpenImageFolder }:CameraControlSpaceProps) {
  return (
    <ControlSpace>
      <IconButton name='lightbulb-on' onPress={onPredict} text='推荐' />
      <LinearGradient style={styles.btn} colors={['#ff6e7f', '#bfe9ff']} start={[0.4, 0.1]}>
        <TouchableOpacity style={styles.btn} onPress={onCapture} />
      </LinearGradient>
      <IconButton name='folder-image' onPress={onOpenImageFolder} text='相册' />
    </ControlSpace>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
});

export default CameraControlSpace;

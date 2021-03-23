import React from 'react';
import { View, StyleSheet } from 'react-native';

import StepIndicator from 'react-native-step-indicator';
import colors from '../../config/colors';
import { DetectMode, StepTypes } from '../../types';


const STEP_LABELS = {
  selectImage : '选择照片',
  adjustDistance : '调整距离',
  adjustPose : '摆好姿势',
  goodToGo : '开始拍照' 
}
const STEP_ARRAY = Object.keys(STEP_LABELS)

const labels = STEP_ARRAY.map((item)=>STEP_LABELS[item])

const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize:30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: colors.success,
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: colors.success,
  stepStrokeUnFinishedColor: colors.medium,
  separatorFinishedColor: colors.success,
  separatorUnFinishedColor: colors.medium,
  stepIndicatorFinishedColor: colors.success,
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: colors.success,
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: colors.medium,
  labelColor: colors.white,
  labelSize: 13,
  currentStepLabelColor: colors.success
}

interface StepProps{
  currentStep: StepTypes
}


function Step({currentStep }:StepProps) {
  const currentPosition = STEP_ARRAY.indexOf(currentStep)
  return (
    <View style={styles.container}>
      <StepIndicator
         customStyles={customStyles}
         labels={labels}
         stepCount={4}
         currentPosition={currentPosition}
    />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '3%',
    width: '100%',
    zIndex: 10
  }
});

export default Step;
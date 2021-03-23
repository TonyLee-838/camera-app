import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import colors from '../../config/colors';
import FadeView from './FadeView';

enum SUGGESTION_MESSAGE {
  tooFar = '请移近一点',
  tooClose = '请移远一点',
  tooRight = '请向右移动摄像头',
  tooLeft = '请向左移动摄像头',
  fine = '完美！',
  none = '没有检测到人像',
  tooHigh = '请向下移动摄像头',
  tooLow = '请向上移动摄像头',
}

interface TipProps {
  text: string;
}

function Tip({ text }: TipProps) {
  console.log(text);

  return (
    <FadeView visible={!!text} style={styles.container}>
      <Text style={styles.text}>{SUGGESTION_MESSAGE[text] || text}</Text>
    </FadeView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 150,
    zIndex: 10,
    alignSelf: 'center',
    borderRadius: 5,
  },
  text: {
    color: colors.darkGreen,
    fontSize: 18,
    marginHorizontal: 15,
    marginVertical: 10,
  },
});

export default Tip;

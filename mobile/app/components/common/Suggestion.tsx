import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import colors from '../../config/colors';
import FadeInOut from 'react-native-fade-in-out/dist/src';

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

interface SuggestionProps {
  content: string;
  duration?: number;
  animationDuration?: number;
}

function Suggestion({ content, duration = 1500, animationDuration = 300 }: SuggestionProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (content) {
      setVisible(true);

      setTimeout(() => {
        setVisible(false);
      }, duration);
    }
  }, [content]);

  return (
    <FadeInOut style={styles.container} visible={visible} duration={animationDuration}>
      <Text style={styles.content}>{SUGGESTION_MESSAGE[content] || content}</Text>
    </FadeInOut>
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
  content: {
    color: colors.darkGreen,
    fontSize: 18,
    marginHorizontal: 15,
    marginVertical: 10,
  },
});

export default Suggestion;

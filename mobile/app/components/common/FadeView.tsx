import React, { ReactNode, useEffect, useState } from 'react';
import { View, StyleSheet, Animated, StyleProp, ViewStyle } from 'react-native';

interface FadeViewProps {
  animationDuration?: number;
  autoFadeout?: boolean;
  autoFadeoutTimeout?: number;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  visible: boolean;
}

const FadeView = ({
  animationDuration = 500,
  autoFadeout = false,
  autoFadeoutTimeout = 1000,
  children,
  style,
  visible,
}: FadeViewProps) => {
  const [animation, setAnimation] = useState(new Animated.Value(0));

  const fadeIn = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: animationDuration,
      useNativeDriver: true,
    }).start();
  };
  const fadeOut = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: animationDuration,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    console.log('====================================');
    console.log(visible);
    console.log('====================================');
    if (visible) {
      fadeIn();
    } else fadeOut();
  }, [visible]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: animation,
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {},
});
export default FadeView;

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { Bar } from 'react-native-progress';
import colors from '../config/colors';

const TEXTS = [
  'Loading Tensorflow...',
  'Loading Model 0/3...',
  'Loading Model 1/3...',
  'Loading Model 2/3...',
];

interface LoadingScreenProps {
  progress: number;
  total: number;
}

const LoadingScreen = ({ progress, total }: LoadingScreenProps) => {
  return (
    <View style={styles.container}>
      <Bar progress={progress / total} />
      <Text style={styles.text}>{TEXTS[progress]}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  text: {
    color: colors.medium,
    marginTop: 5,
  },
});
export default LoadingScreen;

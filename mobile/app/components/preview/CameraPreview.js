import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';

function CameraPreview({ image }) {
  return (
    <View style={styles.container}>
      <ImageBackground source={image} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default CameraPreview;

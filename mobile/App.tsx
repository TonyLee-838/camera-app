import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Alert} from 'react-native';
import * as Permissions from 'expo-permissions';

import CameraScreen from './app/screens/CameraScreen'

export default function App() {
  const requestPermission = async () => {
    const { granted: g1 } = await Permissions.askAsync(Permissions.CAMERA);
    const { granted: g2 } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    if (!g1 || !g2) Alert.alert('无权限');
  };

  useEffect(() => {
    requestPermission();
  }, []);

  return (
    <CameraScreen/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

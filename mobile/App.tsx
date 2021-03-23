import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import * as Permissions from 'expo-permissions';

import CameraScreen from './app/screens/CameraScreen';
import LoadingScreen from './app/screens/LoadingScreen';
import { useModels } from './app/hooks/useModels';

const TOTAL_PROGRESS = 4;

export default function App() {
  const requestPermission = async () => {
    const { granted: g1 } = await Permissions.askAsync(Permissions.CAMERA);
    const { granted: g2 } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    if (!g1 || !g2) Alert.alert('无权限');
  };

  const [progress, setProgress] = useState<number>(0);
  const models = useModels(setProgress);

  useEffect(() => {
    requestPermission();
  }, []);

  return progress < TOTAL_PROGRESS ? (
    <LoadingScreen progress={progress} total={TOTAL_PROGRESS} />
  ) : (
    <CameraScreen models={models} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

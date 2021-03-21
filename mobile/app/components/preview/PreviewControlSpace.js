import React from 'react';
import { StyleSheet } from 'react-native';
import IconButton from '../common/IconButton';
import ControlSpace from '../common/ControlSpace';

function PreviewControlSpace({ onRetake, onSave }) {
  return (
    <ControlSpace>
      <IconButton name='backup-restore' onPress={onRetake} text='重拍' />
      <IconButton name='arrow-down-bold-circle-outline' onPress={onSave} text='保存' />
    </ControlSpace>
  );
}

const styles = StyleSheet.create({});

export default PreviewControlSpace;

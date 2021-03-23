import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { userState } from '../../types/index'

interface TipProps{
  text?: string;
}


const tipMap = {
  'offset': '位置需要微调',
  'far': '距离太远了',
  'close': '距离太近啦',
  'no-person': '没有检测到人',
  'ok': '完美！'
}

function Tip({ text }: TipProps) {
  if(!text) return null;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {tipMap[text]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: '#e0f0e9',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 150,
    zIndex: 10,
    alignSelf: 'center',
    borderRadius: 5
  },
  text: {
    color:'#3d3b4f',
    fontSize: 20,
    marginHorizontal: 15,
    marginVertical: 10
  }
});

export default Tip;
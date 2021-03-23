import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../../config/colors';

interface IconButtonProps{
  name: any;
  size?: number;
  onPress: ()=>void;
  text: string;
}

function IconButton({ name, size = 35, onPress, text }: IconButtonProps) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name={name}
        color={colors.black}
        backgroundColor={colors.white}
        size={size}
        onPress={onPress}
      />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: colors.black,
    fontSize: 20,
  },
});

export default IconButton;

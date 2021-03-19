import React from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '../../config/colors'

function ControlSpace({children}) {
  return (
    <View style={styles.container}>
      {children}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '18%',
  }
});

export default ControlSpace;
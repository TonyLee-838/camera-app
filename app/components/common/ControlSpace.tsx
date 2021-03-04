import React, { FC, ReactElement } from "react";
import { View, StyleSheet } from "react-native";

import colors from "../../config/colors";

const ControlSpace: FC = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: colors.white,
    position: "absolute",
    bottom: 0,
    display: "flex",
    alignItems: "center",
  },
});
export default ControlSpace;

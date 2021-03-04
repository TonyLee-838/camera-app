import React, { FC, ReactElement } from "react";
import { View, StyleSheet } from "react-native";

const AppScreen: FC = ({ children }): ReactElement => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
  },
});
export default AppScreen;

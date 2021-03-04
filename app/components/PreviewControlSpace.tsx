import React, { FC, ReactElement } from "react";
import { View, StyleSheet, Text, TouchableOpacity, GestureResponderEvent } from "react-native";

import ControlSpace from "./common/ControlSpace";
import colors from "../config/colors";

interface PreviewControlSpaceProps {
  onRetake: (event: GestureResponderEvent) => void;
  onSavePhoto: (event: GestureResponderEvent) => void;
}

const PreviewControlSpace: FC<PreviewControlSpaceProps> = ({ onRetake, onSavePhoto }): ReactElement => {
  return (
    <ControlSpace>
      <View style={styles.buttonGroups}>
        <TouchableOpacity style={styles.button} onPress={onRetake}>
          <Text style={styles.buttonLabel}>Retake</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onSavePhoto}>
          <Text style={styles.buttonLabel}>Save</Text>
        </TouchableOpacity>
      </View>
    </ControlSpace>
  );
};

const styles = StyleSheet.create({
  button: {},
  buttonLabel: {
    color: colors.black,
    fontSize: 18,
  },
  buttonGroups: {
    width: "100%",
    paddingVertical: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
export default PreviewControlSpace;

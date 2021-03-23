import React from "react";
import { View, StyleSheet, Text } from "react-native";

enum SUGGESTION_MESSAGE {
  tooFar = "请移近一点",
  tooClose = "请移远一点",
  tooRight = "请向右移动摄像头",
  tooLeft = "请向左移动摄像头",
  fine = "完美！",
  none = "没有检测到人像",
  tooHigh = "请向下移动摄像头",
  tooLow = "请向上移动摄像头",
}

interface TipProps {
  text: string;
  forBox?: boolean;
}

function Tip({ text, forBox = false }: TipProps) {
  if (!text) return null;
  return (
    <View style={styles.container}>
      {forBox ? (
        <Text style={styles.text}>{SUGGESTION_MESSAGE[text]}</Text>
      ) : (
        <Text style={styles.text}>{text}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    backgroundColor: "#e0f0e9",
    justifyContent: "center",
    alignItems: "center",
    bottom: 150,
    zIndex: 10,
    alignSelf: "center",
    borderRadius: 5,
  },
  text: {
    color: "#3d3b4f",
    fontSize: 20,
    marginHorizontal: 15,
    marginVertical: 10,
  },
});

export default Tip;

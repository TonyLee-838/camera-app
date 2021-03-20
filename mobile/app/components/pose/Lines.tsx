import React from "react";
import { View } from "react-native";
import SVG, { Line } from "react-native-svg";
import { Keypoint } from "@tensorflow-models/posenet";

interface LinesProps {
  pointPairs: Keypoint[][];
  color: string;
}

const Lines = ({ pointPairs, color }: LinesProps) => {
  return (
    <View>
      <SVG width="100%" height="100%">
        {pointPairs.map(([point1, point2], i) => (
          <Line
            key={`line-${i}`}
            x1={point1.position.x}
            y1={point1.position.y}
            x2={point2.position.x}
            y2={point2.position.y}
            stroke={color}
            strokeWidth={3}
          />
        ))}
      </SVG>
    </View>
  );
};

export default Lines;

const data = {
  nose: {
    position: {
      x: 1,
      y: 1,
    },
  },
  leftEye: {
    position: {
      x: 1,
      y: 1,
    },
  },
  rightEye: {
    position: {
      x: 1,
      y: 1,
    },
  },
  leftHip: {
    position: {
      x: 1,
      y: 1,
    },
  },
  leftKnee: {
    position: {
      x: 1,
      y: 1,
    },
  },
  leftWrist: {
    position: {
      x: 1,
      y: 1,
    },
  },
  leftElbow: {
    position: {
      x: 1,
      y: 1,
    },
  },
};

const legsPointPairs = [
  ["leftHip", "leftKnee"],
  ["leftKnee", "leftAnkle"],
  ["rightHip", "rightKnee"],
  ["rightKnee", "rightAnkle"],
];

const armsPointPairs = [
  ["leftShoulder", "leftElbow"],
  ["leftElbow", "leftWrist"],
  ["rightShoulder", "rightElbow"],
  ["rightElbow", "rightWrist"],
];

const headPointPairs = [
  ["leftEye", "nose"],
  ["nose", "rightEye"],
];

const select;

const group = (data) => {
  return Object.keys(data).reduce(
    (prev, key) => {
      if (key.match(/nose|eye|ear/i)) {
        prev.head.push(data[key]);
      } else if (key.match(/ankle|knee|hip/i)) {
        prev.legs.push(data[key]);
      } else {
        prev.arms.push(data[key]);
      }
      return prev;
    },
    {
      arms: [],
      legs: [],
      head: [],
    }
  );
};

// group(data);
// console.log(group(data));

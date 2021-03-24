import Constants from "expo-constants";
const settings = {
  dev: {
    backendUrl: "http://10.139.105.169:3003",
  },
  prod: {
    backendUrl: "http://112.74.185.169:3003",
  },
  staging: {
    backendUrl: "http://112.74.185.169:3003",
  },
};

const getCurrentSettings = () => {
  if (__DEV__) return settings.dev;
  if (Constants.manifest.releaseChannel === "staging") return settings.staging;
  return settings.prod;
};

export default getCurrentSettings();

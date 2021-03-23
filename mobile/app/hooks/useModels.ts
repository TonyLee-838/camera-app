import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

import { CocoModel, PoseModel, PredictModel } from '../models';

interface Models {
  predictModel: PredictModel;
  poseModel: PoseModel;
  cocoModel: CocoModel;
}

export const useModels = () => {
  const [predictModel, setPredictModel] = useState<PredictModel>();
  const [poseModel, setPoseModel] = useState<PoseModel>();
  const [cocoModel, setCocoModel] = useState<CocoModel>();

  const initializeTF = async () => {
    try {
      await tf.ready();
      console.log('tf - ready');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    initializeTF();

    setPredictModel(new PredictModel());
    setPoseModel(new PoseModel());
    setCocoModel(new CocoModel());
  }, []);

  return {
    predictModel,
    cocoModel,
    poseModel,
  };
};

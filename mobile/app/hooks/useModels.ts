import { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

import { CocoModel, PoseModel, PredictModel } from '../models';

export const useModels = (setProgress: (number) => void) => {
  const [predictModel] = useState<PredictModel>(new PredictModel());
  const [poseModel] = useState<PoseModel>(new PoseModel());
  const [cocoModel] = useState<CocoModel>(new CocoModel());

  const initializeModels = async () => {
    await predictModel.init();
    console.log('Model Loaded!');
    setProgress(1.5);

    await poseModel.init();
    console.log('Model Loaded!');
    setProgress(3);
    await cocoModel.init();
    console.log('Model Loaded!');
    setProgress(4);
  };

  const initializeTF = async () => {
    await tf.ready();
    setProgress(0.5);
  };

  useEffect(() => {
    initializeTF();
    initializeModels();
  }, []);

  return {
    predictModel,
    cocoModel,
    poseModel,
  };
};

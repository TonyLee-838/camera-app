import axios from 'axios';

const BASE_URL = 'http://10.112.235.88:3003';

export const http = axios.create({
  baseURL: BASE_URL,
});

// data: {features: [...]}
export const getPredictImages = async (params) => {
  const { data } = await http({
    method: 'post',
    url: '/predict',
    data: params,
  });
  console.log('data', data);

  return data;
};

// params: {imageName: ''}
export const getImagePose = async (params) => {
  const { data } = await http({
    method: 'get',
    url: '/pose',
    params,
  });

  return data;
};

export const PREDICT_MODEL_URL = `${BASE_URL}/model/predict/model.json`;
export const POSENET_MODEL_URL = `${BASE_URL}/model/posenet/model.json`;
export const COCO_MODEL_URL = `${BASE_URL}/model/coco/model.json`;

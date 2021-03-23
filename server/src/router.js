const predictRouter = require('./routers/predict');
const poseRouter = require('./routers/pose');


module.exports = function (app) {
  app.use('/predict', predictRouter);
  app.use('/pose', poseRouter);
};

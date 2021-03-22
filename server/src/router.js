const predictRouter = require('./routers/predict');
const poseRouter = require('./routers/pose');
const devLogRouter = require('./routers/dev-log');

module.exports = function (app) {
  app.use('/predict', predictRouter);
  app.use('/pose', poseRouter);
  app.use('/dev-log', devLogRouter);
};

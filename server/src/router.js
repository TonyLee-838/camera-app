const predictRouter = require('./routers/predict');
const poseRouter = require('./routers/pose');
const debugRouter = require('./routers/debug');

module.exports = function (app) {
  app.use('/predict', predictRouter);
  app.use('/pose', poseRouter);
  app.use('/debug', debugRouter);
};

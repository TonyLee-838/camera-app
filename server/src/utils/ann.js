const child_process = require("child_process");

const getTopKSimilarImages = async (features) => {
  return new Promise((resolve) => {
    // 执行python子进程
    var workerProcess = child_process.spawn("python", ["./data/ann.py", features]);
    console.log(workerProcess)
    // 获取python脚本传回来的buffer，并转化为数组
    workerProcess.stdout.on("data", function (data) {
      data = JSON.parse(data.toString());
      console.log("data", data);
      resolve(data);
    });
  });
};

module.exports = getTopKSimilarImages;

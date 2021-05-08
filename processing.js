var canvas = document.getElementById('my-canvas');
let model;
async function loadModel() {
  model = await tf.loadGraphModel('TFJS/model.json');
}

function predictImage() {
  // console.log('Processing...');
  image = cv.imread(canvas);

  cv.cvtColor(image, image, cv.COLOR_BGR2GRAY, 0);

  cv.threshold(image, image, 175, 255, cv.THRESH_BINARY);

  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
  let cnt = contours.get(0);

  let rect = cv.boundingRect(cnt);
  image = image.roi(rect);

  var height = image.rows;
  var width = image.cols;
  var scaleFactor = height > width ? height / 20 : width / 20;
  height = Math.round(height / scaleFactor);
  width = Math.round(width / scaleFactor);
  let dsize = new cv.Size(width, height);
  cv.resize(image, image, dsize, 0, 0, cv.INTER_AREA);
  // console.log(`Height: ${height}, Width: ${width}`);

  const LEFT = Math.ceil(4 + (20 - width) / 2);
  const RIGHT = Math.floor(4 + (20 - width) / 2);
  const TOP = Math.ceil(4 + (20 - height) / 2);
  const BOTTOM = Math.floor(4 + (20 - height) / 2);
  // console.log(`LEFT: ${LEFT}, RIGHT: ${RIGHT}, TOP: ${TOP}, BOTTOM: ${BOTTOM}`);
  let s = new cv.Scalar(0, 0, 0, 0);
  cv.copyMakeBorder(image, image, TOP, BOTTOM, LEFT, RIGHT, cv.BORDER_CONSTANT, s);

  cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
  cnt = contours.get(0);
  let Moments = cv.moments(cnt, false);
  let cx = Moments.m10 / Moments.m00
  let cy = Moments.m01 / Moments.m00

  const X_SHIFT = Math.round(image.cols / 2 - cx);
  const Y_SHIFT = Math.round(image.rows / 2 - cy);
  let M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, X_SHIFT, 0, 1, Y_SHIFT]);
  dsize = new cv.Size(image.rows, image.cols);
  cv.warpAffine(image, image, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, s);

  // Testing code
  // var outputCanvas = document.createElement('CANVAS');
  // cv.imshow(outputCanvas, image);
  // document.body.appendChild(outputCanvas);

  let pixelValues = new Float32Array(image.data);
  pixelValues = pixelValues.map(function(item) {
    return item / 255;
  })

  tensorValue = tf.tensor([pixelValues]);
  const result = model.predict(tensorValue);
  const output = result.dataSync()[0];
  tensorValue.dispose();
  result.dispose();

  image.delete();
  contours.delete();
  hierarchy.delete();
  cnt.delete();
  M.delete();

  return output;
}

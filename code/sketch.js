let bodyPose, faceMesh, video, osc;
let poses = [], faces = [];
let step = -1;   // -1 = waiting, 0 to 2 = tasks, 3 = done
let ok = 0;      // how long the current task has been true
const HOLD = 30; // frames to hold each task
const tasks = [
  "Stand back so we see your body",
  "Raise both hands above your head",
  "Look at the camera, eyes open"
];

function preload() {
  bodyPose = ml5.bodyPose();
  faceMesh = ml5.faceMesh({ maxFaces: 1 });
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  bodyPose.detectStart(video, r => poses = r);
  faceMesh.detectStart(video, r => faces = r);
  osc = new p5.Oscillator("square");
  osc.freq(800);
  osc.amp(0);
  textSize(28);
  textAlign(CENTER);
}

function mousePressed() {
  if (step === -1 || step === 3) {
    userStartAudio();
    osc.start();
    step = 0;
    ok = 0;
  }
}

function taskDone() {
  if (step === 0 && poses.length > 0) {
    let k = poses[0].keypoints;
    // hips clearly below shoulders means you are upright
    return k[5].confidence > 0.3 && k[11].confidence > 0.3 && k[11].y - k[5].y > 100;
  }
  if (step === 1 && poses.length > 0) {
    let k = poses[0].keypoints;
    // both wrists higher than the nose
    return k[9].y < k[0].y && k[10].y < k[0].y;
  }
  if (step === 2 && faces.length > 0) {
    let f = faces[0].keypoints;
    // eye height divided by eye width, small when closed
    let left = dist(f[159].x, f[159].y, f[145].x, f[145].y) / dist(f[33].x, f[33].y, f[133].x, f[133].y);
    let right = dist(f[386].x, f[386].y, f[374].x, f[374].y) / dist(f[362].x, f[362].y, f[263].x, f[263].y);
    return left > 0.2 && right > 0.2;
  }
  return false;
}

function draw() {
  image(video, 0, 0, 640, 480);
  fill(255);
  stroke(0);
  strokeWeight(4);

  if (step === -1) {
    osc.amp(0);
    text("Click to start the alarm", 320, 240);
    return;
  }
  if (step === 3) {
    osc.amp(0);
    text("You are awake! Click to restart", 320, 240);
    return;
  }

  osc.amp(frameCount % 30 < 15 ? 0.2 : 0); // beeping
  text("ALARM! " + tasks[step], 320, 40);
  text("Step " + (step + 1) + " of 3", 320, 450);

  ok = taskDone() ? ok + 1 : 0;
  if (ok > HOLD) {
    step++;
    ok = 0;
  }
}

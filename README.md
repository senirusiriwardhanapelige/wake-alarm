# Wake Alarm

This repository contains a browser-based wake-up alarm prototype that uses your webcam to verify that you are awake before the alarm will stop.

## What it does

- Plays a loud periodic tone (alarm) when started.
- Requires the user to complete three verification steps to stop the alarm:
  1. Stand back so the body is visible to the camera
  2. Raise both hands above the head
  3. Look at the camera with eyes open
- Each step must be held for a short period (frames) for the program to accept it as completed.

## How it works (technical)

- Uses p5.js for rendering and audio and ml5.js for ML models (runs in the browser).
- Body detection: ml5.bodyPose() is used to obtain keypoints for the body (shoulders, hips, wrists, etc.).
  - Step 1 checks that hips are below shoulders (user is upright and visible).
  - Step 2 checks that both wrists are above the nose (hands raised).
- Face detection: ml5.faceMesh() provides facial landmarks.
  - Step 3 uses eye landmark distances (eye height / eye width ratio) to detect open eyes.
- The sketch holds each successful step for a fixed number of frames (HOLD) before advancing to the next.

## Privacy

- All video processing happens locally in your browser. No video data is uploaded to any server by this code (ml5 models run locally in the browser).
- You must allow camera access for the sketch to work.

## Folder structure

- code/
  - index.html  — webpage that loads the sketch
  - sketch.js   — p5 + ml5 sketch with the alarm logic
- README.md     — this file

## Run locally

1. Clone the repository (or download):

```bash
git clone https://github.com/senirusiriwardhanapelige/wake-alarm.git
cd wake-alarm
```

2. Serve with a local static server (required for getUserMedia in some browsers):

```bash
# Python 3
python3 -m http.server 8000
```

3. Open http://localhost:8000/code/ in your browser.

## Notes & tuning

- Lighting, camera FOV, and distance affect detection. You may need to tweak the numeric thresholds in sketch.js for your environment.
- Click the page once to enable audio (most browsers require user interaction before starting audio).

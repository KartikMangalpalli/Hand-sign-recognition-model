let classifier;
let video;
let img;
let label = "Loading...";
let accumulatedText = "";
let labelCooldown = 30;
let cooldownCounter = 0;
let modelURL = "https://teachablemachine.withgoogle.com/models/RHpIlM9iD/";

function preload() {
  if (typeof ml5 !== "undefined") {
    classifier = ml5.imageClassifier(modelURL + "model.json", modelReady);
  } else {
    console.error("ml5.js not loaded.");
  }
}

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent("canvas-container");

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  createUploadButton();
  createConfirmButton();
}

function createUploadButton() {
  let uploadBtn = createFileInput(handleFile);
  uploadBtn.class("upload-btn");
  uploadBtn.parent("upload-container");
}

function createConfirmButton() {
  let btn = createButton("✅ Add Character");
  btn.class("upload-btn");
  btn.parent("output-container");
  btn.mousePressed(() => {
    if (label && label !== "Loading...") {
      accumulatedText += label;
      document.getElementById("outputText").innerText = accumulatedText;
    }
  });
}

function handleFile(file) {
  if (file.type === 'image') {
    img = loadImage(file.data, () => {
      classifyImage(img);
    });
  } else {
    console.log("Upload an image file only.");
  }
}

function modelReady() {
  console.log("Model Loaded!");
  classifyVideo();
}

function classifyVideo() {
  if (classifier && video) {
    classifier.classify(video, gotResult);
  }
}

function classifyImage(image) {
  if (classifier && image) {
    classifier.classify(image, gotResult);
  }
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }

  let current = results[0]?.label;

  if (current && current !== label && cooldownCounter <= 0) {
    label = current;
    cooldownCounter = labelCooldown;
  }

  if (!img) classifyVideo();
}

function draw() {
  background(0);
  if (img) {
    image(img, 0, 0, width, height);
  } else {
    image(video, 0, 0, width, height);
  }

  fill(255);
  textSize(24);
  textAlign(CENTER, CENTER);
  text("Detected: " + label, width / 2, height - 20);

  if (cooldownCounter > 0) cooldownCounter--;
}

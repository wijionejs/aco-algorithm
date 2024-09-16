import Canvas from "./Canvas.js";
import ACOAlgorithm from "./ACOAlgorithm.js";
import Graph from "./Graph.js";

const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");
const canvasEl = document.getElementById('canvas');
const shortestPathEl = document.getElementById("shortest-path");
const shortestDistanceEl = document.getElementById("shortest-distance");
const numberOfIterationsEl = document.getElementById("iterations-number");
const statusEl = document.getElementById("status");

canvasEl.addEventListener("click", onCanvasClick);
startBtn.addEventListener("click", start);
pauseBtn.addEventListener("click", pause);
resetBtn.addEventListener("click", reset);

let graph = new Graph();
let canvas = new Canvas(canvasEl, graph);
let algorithm;
let requestAnimationFrameId;
let isStarted = false;
let isPaused = false;

function onCanvasClick(event) {
  if (isStarted) return;

  const rect = canvasEl.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  graph.addCity(x, y);
  rerender()
}

function start() {
  if (graph.cities.length < 3) return;

  if (isStarted && isPaused) {
    isPaused = false;
    iterate();
    toggleButtonClasses();
    return;
  }

  isStarted = true;
  algorithm = new ACOAlgorithm(graph);

  iterate();
  toggleButtonClasses();
}

function pause() {
  isPaused = true;
  cancelAnimationFrame(requestAnimationFrameId);
  toggleButtonClasses();
  rerender();
}

function reset() {
  cancelAnimationFrame(requestAnimationFrameId);
  graph = new Graph();
  canvas = new Canvas(canvasEl, graph);
  algorithm = new ACOAlgorithm(graph);
  isStarted = false;
  isPaused = false;

  rerender();
  toggleButtonClasses();
}

function iterate() {
  if(algorithm.isFinished) {
    toggleButtonClasses();
    return;
  };

  algorithm.iterate();
  rerender();
  requestAnimationFrameId = requestAnimationFrame(iterate);
}

function rerender() {
  canvas.redrawGraph(algorithm?.pheromoneMatrix, algorithm?.shortest_path);

  shortestPathEl.innerHTML = algorithm?.shortest_path?.map(city => city.id).join(" -> ") || "N/A";
  shortestDistanceEl.innerHTML = Math.round(algorithm?.shortest_distance || Infinity);
  numberOfIterationsEl.innerHTML = algorithm?.iterations || 0;
  statusEl.innerHTML = getCurrentStatus();
}

function toggleButtonClasses() {
  if (algorithm?.isFinished) {
    pauseBtn.classList.add("hidden");
    startBtn.classList.add("hidden");
  } else if (isStarted && !isPaused) {
    pauseBtn.classList.remove("hidden");
    startBtn.classList.add("hidden");
  } else {
    pauseBtn.classList.add("hidden");
    startBtn.classList.remove("hidden");
  }
}

function getCurrentStatus() {
  let currentStatus;

  if (algorithm?.isFinished) {
    currentStatus = "Finished"
  } else if (isPaused) {
    currentStatus =  "Paused"
  } else if (isStarted) {
    currentStatus = "Running"
  } else {
    currentStatus = "Ready"
  }

  return currentStatus;
}

rerender()

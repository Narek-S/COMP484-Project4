// -------------------- SELECTORS --------------------
const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
const originTextElement = document.querySelector("#origin-text p");
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");

const wpmDisplay = document.querySelector("#wpm");
const errorDisplay = document.querySelector("#errors");
const scoreDisplay = document.querySelector("#scores");

// -------------------- GLOBAL VARIABLES --------------------
let timer = [0, 0, 0];
let interval;
let timerRunning = false;
let errors = 0;

// Paragraph list (REQUIREMENT: at least 5)
const texts = [
  "The quick brown fox jumps over the lazy dog.",
  "Typing tests help improve speed and accuracy.",
  "JavaScript makes websites interactive and fun.",
  "Practice daily to become a faster typist.",
  "Consistency is the key to mastering typing."
];

// -------------------- TIMER --------------------

// Add leading zero (for clean format)
function leadingZero(time) {
  return time <= 9 ? "0" + time : time;
}

// Runs timer every 10ms
function runTimer() {
  timer[2]++;

  if (timer[2] === 100) {
    timer[1]++;
    timer[2] = 0;
  }

  if (timer[1] === 60) {
    timer[0]++;
    timer[1] = 0;
  }

  let currentTime =
    leadingZero(timer[0]) + ":" +
    leadingZero(timer[1]) + ":" +
    leadingZero(timer[2]);

  theTimer.innerHTML = currentTime;
}

// -------------------- MATCH TEXT --------------------

function spellCheck() {
  let textEntered = testArea.value;
  let originText = originTextElement.innerHTML.substring(0, textEntered.length);

  // CHECK COMPLETION FIRST
  if (textEntered === originTextElement.innerHTML) {
    testWrapper.style.borderColor = "green";
    clearInterval(interval);
    saveScore();
  } 
  // THEN check partial match
  else if (textEntered === originText) {
    testWrapper.style.borderColor = "blue";
  } 
  // Otherwise it's wrong
  else {
    testWrapper.style.borderColor = "red";
    errors++;
    errorDisplay.innerHTML = errors;
  }

  updateWPM();
}

// -------------------- START TIMER --------------------

function start() {
  let textLength = testArea.value.length;

  if (textLength === 0 && !timerRunning) {
    timerRunning = true;
    interval = setInterval(runTimer, 10);
  }
}

// -------------------- RESET --------------------

function reset() {
  clearInterval(interval);

  // Reset values
  timer = [0, 0, 0];
  timerRunning = false;
  testArea.value = "";
  theTimer.innerHTML = "00:00:00";
  testWrapper.style.borderColor = "grey";

  errors = 0;
  errorDisplay.innerHTML = 0;
  wpmDisplay.innerHTML = 0;

  // Load random text
  loadRandomText();
}

// -------------------- RANDOM TEXT --------------------

function loadRandomText() {
  let randomIndex = Math.floor(Math.random() * texts.length);
  originTextElement.innerHTML = texts[randomIndex];
}

// -------------------- WPM CALCULATION --------------------

function updateWPM() {
  let totalTime = timer[0] * 60 + timer[1] + timer[2] / 100;
  let chars = testArea.value.length;

  if (totalTime > 0) {
    let wpm = Math.round((chars / 5) / (totalTime / 60));
    wpmDisplay.innerHTML = wpm;
  }
}

// -------------------- LOCAL STORAGE (TOP 3 SCORES) --------------------

function saveScore() {
  let totalTime = timer[0] * 60 + timer[1] + timer[2] / 100;

  let scores = JSON.parse(localStorage.getItem("scores")) || [];

  scores.push(totalTime);

  // Sort lowest time = best
  scores.sort((a, b) => a - b);

  // Keep top 3
  scores = scores.slice(0, 3);

  localStorage.setItem("scores", JSON.stringify(scores));

  displayScores();
}

function displayScores() {
  let scores = JSON.parse(localStorage.getItem("scores")) || [];

  scoreDisplay.innerHTML = scores.map(s => s.toFixed(2) + "s").join(", ");
}

// -------------------- EVENT LISTENERS --------------------

testArea.addEventListener("keypress", start);
testArea.addEventListener("keyup", spellCheck);
resetButton.addEventListener("click", reset);

// Load initial state
loadRandomText();
displayScores();
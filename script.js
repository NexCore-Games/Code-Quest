// Execute rendering of the number grid when the page loads
window.onload = initializeGame;
function initializeGame() {
  renderNumberGrid();
  updateLevelDisplay();
  playStorylineAudio();
  playAudioButton();
}
function playStorylineAudio() {
  const introVoice = document.getElementById("introVoice");
  const pixelVoice = document.getElementById("pixelVoice");
  introVoice.onerror = () => console.error("Failed to play intro voice!");
  pixelVoice.onerror = () => console.error("Failed to play pixel voice!");

    introVoice.play();
  introVoice.onended = () => {
    pixelVoice.play();
  };
}
function startGame() {
  window.location.href = "storyline.html";
}
let numbers = [3, 5, 1, 4, 2, 6, 8, 7, 9]; // Initial numbers
const correctOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // Correct order for comparison
let selectedNumbers = []; // Track selected numbers by the user
let currentLevel = 1; // Track current level
let hintsUsed = 0; // Track hints used
const maxHints = 3; // Max hints per level
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
function renderNumberGrid() {
  shuffleArray(numbers); // Shuffle numbers each time the game loads
  const gridContainer = document.getElementById("number-grid");
  if (!gridContainer) return; // Prevent errors if the element doesn't exist

  gridContainer.innerHTML = ""; // Clear existing grid

  numbers.forEach((num, index) => {
    const button = document.createElement("button");
    button.innerText = num;
    button.setAttribute("data-index", index);
    button.onclick = () => handleClick(button);
    button.style.backgroundColor = "#1c1c1c"; // Reset color
    gridContainer.appendChild(button);
  });
}

// Handle number clicks
function handleClick(button) {
  const num = parseInt(button.innerText);
  if (!selectedNumbers.includes(num)) {
    selectedNumbers.push(num);
    button.style.backgroundColor = "#ff00d4"; // Highlight selected
  } else {
    selectedNumbers = selectedNumbers.filter((n) => n !== num);
    button.style.backgroundColor = "#1c1c1c"; // Reset color
  }
}

// Check if the puzzle is solved
function checkPuzzle() {
  if (selectedNumbers.length !== correctOrder.length) {
    alert("You need to select all numbers in the correct order!");
    return;
  }

  if (JSON.stringify(selectedNumbers) === JSON.stringify(correctOrder)) {
    alert(`Level ${currentLevel} Complete! Moving to the next level...`);
    levelUp();
  } else {
    alert("Incorrect order, try again!");
  }
}

document.getElementById("checkButton")?.addEventListener("click", checkPuzzle);

// Level-Up: Move to the next level
function levelUp() {
  currentLevel++;
  hintsUsed = 0; // Reset hints for the new level
  updateLevelDisplay();

  if (currentLevel === 2) {
    startLogicLock();
  } else if (currentLevel === 3) {
    startDebugMaze();
  } if (currentLevel > 3) {
    alert("You've completed all available levels! More levels coming soon!");
    return; // Stop further level progression
  }
  currentLevel = level;
  loadLevel(currentLevel);
}

// Update the level display
function updateLevelDisplay() {
  const levelDisplay = document.getElementById("level-display");
  if (levelDisplay) {
    levelDisplay.innerText = `Level: ${currentLevel}`;
  }
}

// Hint functionality
function hintButton() {
  if (hintsUsed >= maxHints) {
    alert("No more hints available for this level!");
    return;
  }

  const gridContainer = document.getElementById("number-grid");
  let hintGiven = false;

  numbers.forEach((num, index) => {
    if (!hintGiven && num !== correctOrder[index]) {
      const button = gridContainer.children[index];
      button.style.backgroundColor = "yellow"; // Highlight incorrect button
      hintGiven = true;
      hintsUsed++;

      setTimeout(() => {
        button.style.backgroundColor = "#1c1c1c";
      }, 2000);
    }
  });

  if (!hintGiven) {
    alert("No hints available! The puzzle is already solved.");
  }
}

document.getElementById("hintButton")?.addEventListener("click", hintButton);

// Solve functionality
function solveStepButton() {
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] !== correctOrder[i]) {
      const correctValue = correctOrder[i];
      const incorrectIndex = numbers.indexOf(correctValue);

      [numbers[i], numbers[incorrectIndex]] = [numbers[incorrectIndex], numbers[i]];

      renderNumberGrid();
      return; // Solve one step at a time
    }
  }

  alert("Puzzle is fully solved!");
}

document.getElementById("solveButton")?.addEventListener("click", solveStepButton);

// Go back to the main menu
function goBack() {
  window.location.href = "index.html";
}

document.getElementById("menuButton")?.addEventListener("click", goBack);

// Logic Lock (Level 2)
function startLogicLock() {
  const gridContainer = document.getElementById("number-grid");
  gridContainer.innerHTML = "<p>Use AND/OR operators to complete the circuit:</p>";

  // Array of problems and answers
  const logicProblems = [
    { problem: "(A OR B) AND C = ?", answer: "TRUE" },
    { problem: "(A OR C) AND B = ?", answer: "FALSE" },
    { problem: "(A AND B) OR C = ?", answer: "TRUE" },
    { problem: "A AND (B OR C) = ?", answer: "FALSE" },
    { problem: "(A AND B) AND C = ?", answer: "FALSE" },
    { problem: "A OR (B AND C) = ?", answer: "TRUE" },
  ];

  // Randomly select a problem
  const randomIndex = Math.floor(Math.random() * logicProblems.length);
  const selectedProblem = logicProblems[randomIndex];

  // Display the problem
  const problem = document.createElement("p");
  problem.innerText = selectedProblem.problem;
  gridContainer.appendChild(problem);

  // Create input for the answer
  const answerInput = document.createElement("input");
  answerInput.type = "text";
  answerInput.placeholder = "Enter TRUE or FALSE";
  gridContainer.appendChild(answerInput);

  // Create submit button
  const submitButton = document.createElement("button");
  submitButton.innerText = "Submit";
  submitButton.onclick = () => {
    const userAnswer = answerInput.value.trim().toUpperCase();
    if (userAnswer === selectedProblem.answer) {
      alert("Correct! Moving to Level 3...");
      levelUp(); // Proceed to the next level
    } else {
      alert("Incorrect. Try again!");
    }
  };
  gridContainer.appendChild(submitButton);
}

function startDebugMaze() {
  const gridContainer = document.getElementById("number-grid");
  gridContainer.innerHTML = "<p>Navigate the maze to avoid bugs and find the hidden finish!</p>";

  const maze = document.createElement("div");
  maze.id = "maze";
  maze.style.display = "grid";
  maze.style.gridTemplateColumns = "repeat(4, 1fr)"; // Updated to a 4x4 grid for added complexity
  maze.style.gap = "10px";

  // Create randomized maze cells
  const cells = Array(16).fill(""); // 16 cells for a 4x4 grid
  const finishIndex = Math.floor(Math.random() * 16); // Randomize "Finish" position
  cells[finishIndex] = "Finish";

  // Add "Bug" cells to 5 random positions, avoiding the "Finish" index
  let bugCount = 0;
  while (bugCount < 5) {
    const bugIndex = Math.floor(Math.random() * 16);
    if (cells[bugIndex] === "" && bugIndex !== finishIndex) {
      cells[bugIndex] = "Bug";
      bugCount++;
    }
  }

  // Level 3 completion logic
  // Generate the maze grid dynamically
  cells.forEach((cell, index) => {
    const cellDiv = document.createElement("div");
    cellDiv.innerText = cell === "Finish" ? "" : cell; // Hide "Finish" text
    cellDiv.style.padding = "20px";
    cellDiv.style.border = "1px solid black";
    cellDiv.style.textAlign = "center";
    cellDiv.style.backgroundColor = "#1c1c1c";
    cellDiv.style.color = "white";

    if (cell === "Bug") {
      cellDiv.onclick = () => {
        alert("You hit a bug! Try again.");
        cellDiv.style.backgroundColor = "red"; // Highlight bug when clicked
      };
    } else if (cell === "Finish") {
      cellDiv.onclick = () => {
        alert("Congratulations! You completed the game!");
        cellDiv.style.backgroundColor = "green"; // Highlight finish when clicked
      };
    } else {
      cellDiv.onclick = () => {
        alert("Keep searching!");
        cellDiv.style.backgroundColor = "#888"; // Mark explored cells
      };
    }

    maze.appendChild(cellDiv);
  });

  gridContainer.appendChild(maze);
}
// const successSound = new Audio('sounds/correct.mp3');
// successSound.play();

function showHowToPlay() {
  const modal = document.getElementById("howToPlayModal");
  modal.classList.add("show");
}
function upcomingFeature() {
  alert("This feature is coming soon! Stay tuned!");
  }
function openSettings() {
  const modal = document.getElementById("settingsModal");
  modal.classList.add("show");
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove("show");
}

// Handle volume changes
document.getElementById("volumeControl")?.addEventListener("input", (event) => {
  const volume = event.target.value;
  console.log(`Volume set to: ${volume}%`);
  // Adjust game sounds accordingly
});
const backgroundAudio = document.getElementById("backgroundAudio");
  const volumeControl = document.getElementById("volumeControl");
  const playPauseAudioButton = document.getElementById("playPauseAudio");
  const stopAudioButton = document.getElementById("stopAudio");

  // Initial volume setup
  backgroundAudio.volume = volumeControl.value / 100;

  // Volume control
  volumeControl.addEventListener("input", () => {
    backgroundAudio.volume = volumeControl.value / 100;
  });

  // Play/Pause button functionality
  playPauseAudioButton.addEventListener("click", () => {
    if (backgroundAudio.paused) {
      backgroundAudio.play();
      playPauseAudioButton.textContent = "Pause Audio";
    } else {
      backgroundAudio.pause();
      playPauseAudioButton.textContent = "Play Audio";
    }
  });

  // Stop audio button functionality
  stopAudioButton.addEventListener("click", () => {
    backgroundAudio.pause();
    backgroundAudio.currentTime = 0;
    playPauseAudioButton.textContent = "Play Audio";
  });

  // Close modal function
  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = "none";
    }
  }

  // Open modal for testing
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = "block";
    }
  }
  
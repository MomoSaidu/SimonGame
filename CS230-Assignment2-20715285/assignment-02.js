document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.game-button');
  const startBtn = document.querySelector('#start-btn');
  const scoreDisplay = document.querySelector('#score-display');
  const highScoreDisplay = document.querySelector('#high-score-display');
  const light = document.querySelector('.light');

  let gameOn = false;
  let pattern = [];
  let currentStep = 0;
  let score = 0;
  let highScore = 0;
  let interval = 1000; // Initial interval for flashing buttons
  let timeoutID; // Timeout ID for player's response check

  function adjustInterval() {
    if (pattern.length > 13) interval = 700;
    else if (pattern.length > 9) interval = 800;
    else if (pattern.length > 5) interval = 900;
    else interval = 1000;
  }

  function generatePattern() {
    const colors = ['green', 'red', 'yellow', 'blue'];
    pattern.push(colors[Math.floor(Math.random() * colors.length)]);
  }

  function flashButton(button) {
    button.classList.add('active');
    setTimeout(() => button.classList.remove('active'), 400); // Adjust for visual clarity
  }

  function playPattern() {
    adjustInterval(); // Adjust the speed based on the sequence length
    let index = 0;
    gameOn = true; // Ensure game is considered active
    const patternInterval = setInterval(() => {
      if (index < pattern.length) {
        const button = document.querySelector(`#${pattern[index]}`);
        flashButton(button);
        if (index === pattern.length - 1) {
          // Set a timeout for player's response after the last button is flashed
          setResponseTimeout();
        }
        index++;
      } else {
        clearInterval(patternInterval); // End pattern display
      }
    }, interval);
  }

  // Set a timeout for player's response after the entire sequence is shown
  function setResponseTimeout() {
    clearTimeout(timeoutID); // Clear any existing timeout
    timeoutID = setTimeout(() => {
      failSequence(); // Trigger fail sequence if the player doesn't respond in time
    }, 5000);
  }

  function failSequence() {
    gameOn = false; // Prevent further input during failure indication
    flashAllButtons(5, 500);
    gameOver();
  }

  function flashAllButtons(times, interval) {
    let count = 0;
    const flashInterval = setInterval(() => {
      buttons.forEach(button => button.classList.toggle('active'));
      if (++count === times * 2) {
        clearInterval(flashInterval);
      }
    }, interval / 2);
  }

  function gameOver() {
    gameOn = false;
    light.classList.remove('green');
    light.classList.add('red');
    startBtn.textContent = 'START';
    highScore = Math.max(score, highScore);
    highScoreDisplay.textContent = highScore.toString().padStart(2, '0');
    score = 0;
    scoreDisplay.textContent = score.toString().padStart(2, '0');
    pattern = [];
    currentStep = 0;
  }

  startBtn.addEventListener('click', () => {
    if (!gameOn) {
      gameOn = true;
      startBtn.textContent = 'WAIT...';
      light.classList.remove('green');
      light.classList.add('red');
      setTimeout(() => {
        light.classList.remove('red');
        light.classList.add('green');
        startBtn.textContent = 'GO!';
        generatePattern();
        playPattern();
      }, 3000); // Wait 3 seconds before starting the sequence
    }
  });

  buttons.forEach(button => {
    button.addEventListener('click', event => {
      if (!gameOn) return; // Ignore clicks if game hasn't started
      clearTimeout(timeoutID); // Cancel the failure sequence timer on player's response
      const correctButton = pattern[currentStep];
      if (event.target.id === correctButton) {
        flashButton(event.target);
        if (++currentStep === pattern.length) {
          score++;
          scoreDisplay.textContent = score.toString().padStart(2, '0');
          currentStep = 0; // Reset for next round
          setTimeout(() => {
            generatePattern();
            playPattern();
          }, 1000); // Give a brief pause before the next sequence
        } else {
          // Reset the timeout waiting for the next button press after each successful press
          setResponseTimeout();
        }
      } else {
        failSequence(); // Incorrect button press
      }
    });
  });
});

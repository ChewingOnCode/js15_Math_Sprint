// Pages
const gamePage = document.getElementById("game-page");
const scorePage = document.getElementById("score-page");
const splashPage = document.getElementById("splash-page");
const countdownPage = document.getElementById("countdown-page");
// Splash Page
const startForm = document.getElementById("start-form");
const radioContainers = document.querySelectorAll(".radio-container");
const radioInputs = document.querySelectorAll("input");
const bestScores = document.querySelectorAll(".best-score-value");
// Countdown Page
const countdown = document.querySelector(".countdown");
// Game Page
const itemContainer = document.querySelector(".item-container");
// Score Page
const finalTimeEl = document.querySelector(".final-time");
const baseTimeEl = document.querySelector(".base-time");
const penaltyTimeEl = document.querySelector(".penalty-time");
const playAgainBtn = document.querySelector(".play-again");

// Equations
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = "0.0";
// Scroll
let valueY = 0;

// Reset Game
function playAgain() {
	gamePage.addEventListener("click", startTimer);
	scorePage.hidden = true;
	splashPage.hidden = false;
	equationsArray = [];
	playerGuessArray = [];
	valueY = 0;
	playAgainBtn.hidden = true;
}
// Show ScorePage
function showScorePage() {
	// Show play again button after 1 sec
	setTimeout(() => {
		playAgainBtn.hidden = false;
	}, 1000);
	gamePage.hidden = true;
	scorePage.hidden = false;
}

//  Scores to DOM, format and display time to DOM
function scoresToDOM() {
	finalDisplayTime = finalTime.toFixed(1);
	baseTime = timePlayed.toFixed(1);
	penaltyTime = penaltyTime.toFixed(1);
	baseTimeEl.textContent = `Base Time: ${baseTime}s`;
	penaltyTimeEl.textContent = `Penalty: +${penaltyTime}s`;
	finalTimeEl.textContent = `${finalTimeDisplay}s`;
	// Scroll to Top
	itemContainer.scrollTo({ top: 0, behavior: "instant" });
	showScorePage();
}

// Stop Timer,Process Results, go to Score Page
function checkTime() {
	console.log(timePlayed);
	if (playerGuessArray.length == questionAmount) {
		console.log("player guess array:", playerGuessArray);
		clearInterval(timer);
		// Check for wrong answers, add penalty time
		equationsArray.forEach((equation, index) => {
			if (equation.evaluated === playerGuessArray[index]) {
				// Correct Guess, no Penalty
			} else {
				// Incorrect Guess add penalty
				penaltyTime += 0.5;
			}
		});
		finalTime = timePlayed + penaltyTime;
		console.log(
			"time:",
			timePlayed,
			"penalty:",
			penaltyTime,
			"final:",
			finalTime
		);
		scoresToDOM();
	}
}
// Add a 10th of a second to timePlayed
function addTime() {
	timePlayed += 0.1;
	checkTime();
}
// Start timer when gamePage is clicked
function startTimer() {
	// Reset Times
	timePlayed = 0;
	penaltyTime = 0;
	finalTime = 0;
	timer = setInterval(addTime, 100);
	gamePage.removeEventListener("click", startTimer);
}

// Scroll and Store User Selection in Player Guess Array
function select(guessedTrue) {
	console.log("player guess array:", playerGuessArray);
	//Scroll 80px at a time
	valueY += 80;
	itemContainer.scroll(0, valueY);
	// Add Player guess to array
	return guessedTrue
		? playerGuessArray.push("true")
		: playerGuessArray.push("false");
}

// Display Game Page
function showGamePage() {
	gamePage.hidden = false;
	countdownPage.hidden = true;
}

//  Get random number up to a max number
function getRandomNumber(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

// Create Correct/Incorrect Random Equations
function createEquations() {
	// Randomly choose how many correct equations there should be
	const correctEquations = getRandomNumber(questionAmount);
	console.log("correct questions:", correctEquations);
	// Set amount of wrong equations
	const wrongEquations = questionAmount - correctEquations;
	console.log("wrong questions:", wrongEquations);
	// Loop through, multiply random numbers up to 9, push to array
	for (let i = 0; i < correctEquations; i++) {
		firstNumber = getRandomNumber(9);
		secondNumber = getRandomNumber(9);
		const equationValue = firstNumber * secondNumber;
		const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
		equationObject = { value: equation, evaluated: "true" };
		equationsArray.push(equationObject);
	}
	// Loop through, mess with the equation results, push to array
	for (let i = 0; i < wrongEquations; i++) {
		firstNumber = getRandomNumber(9);
		secondNumber = getRandomNumber(9);
		const equationValue = firstNumber * secondNumber;
		wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
		wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
		wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
		const formatChoice = getRandomNumber(3);
		const equation = wrongFormat[formatChoice];
		equationObject = { value: equation, evaluated: "false" };
		equationsArray.push(equationObject);
	}
	shuffle(equationsArray);
}

// Add equations to DOM
function equationsToDOM() {
	equationsArray.forEach((equation) => {
		// Item
		const item = document.createElement("div");
		item.classList.add("item");
		// Equation Text
		const equationText = document.createElement("h1");
		equationText.textContent = equation.value;
		// Append
		item.appendChild(equationText);
		itemContainer.appendChild(item);
	});
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
	//   // Reset DOM, Set Blank Space Above
	itemContainer.textContent = "";
	//   // Spacer
	const topSpacer = document.createElement("div");
	topSpacer.classList.add("height-240");
	//   // Selected Item
	const selectedItem = document.createElement("div");
	selectedItem.classList.add("selected-item");
	//   // Append
	itemContainer.append(topSpacer, selectedItem);

	//   // Create Equations, Build Elements in DOM
	createEquations();
	equationsToDOM();
	//   // Set Blank Space Below
	const bottomSpacer = document.createElement("div");
	bottomSpacer.classList.add("height-500");
	itemContainer.appendChild(bottomSpacer);
}

// run countdown
function countdownStart() {
	countdown.textContent = "3";
	setTimeout(() => {
		countdown.textContent = "2";
	}, 1000);
	setTimeout(() => {
		countdown.textContent = "1";
	}, 2000);
	setTimeout(() => {
		countdown.textContent = "Go!";
	}, 3000);
}

// Navigate from splash page to countdown page
function showCountdown() {
	// remove hidden from countdown and added to splash page
	countdownPage.hidden = false;
	splashPage.hidden = true;
	countdownStart();
	populateGamePage();
	setTimeout(showGamePage, 400);
}

// Get the value from selected radio button
function getRadioValue() {
	let radioValue;
	radioInputs.forEach((radioInput) => {
		if (radioInput.checked) {
			radioValue = radioInput.value;
		}
	});
	return radioValue;
}

// Form the decides question amount
function selectQuestionAmount(e) {
	e.preventDefault();
	questionAmount = getRadioValue();
	console.log("question amount:", questionAmount);
	if (questionAmount) {
		showCountdown();
	}
}

startForm.addEventListener("click", () => {
	radioContainers.forEach((radioEl) => {
		// Remove selected label styling
		radioEl.classList.remove("selected-label");
		// Add if radio input is 'checked'
		if (radioEl.children[1].checked) {
			radioEl.classList.add("selected-label");
		}
	});
});

// Event Listeners
startForm.addEventListener("submit", selectQuestionAmount);
gamePage.addEventListener("click", startTimer);

'use strict';

const dom = {
	display: document.querySelector('.display'),
	displayText: document.querySelector('.display-text'),
	operators: document.querySelectorAll('.operator'),
	numbers: document.querySelectorAll('.number'),
	activateOperator(operator) {
		const prevActiveDomOperator = document.querySelector('.active-operator');
		const domOperator = document.querySelector(`[data-key="${operator}"]`);
		if (prevActiveDomOperator) {
			prevActiveDomOperator.classList.remove('active-operator');
		}
		if (domOperator) {
			domOperator.classList.add('active-operator');
		}
	},
	updateDisplayText(text) {
		this.displayText.textContent = text;
		// Make the scroll flush to the right
		this.display.scrollLeft = this.display.scrollWidth;
	},
	equals: document.querySelector('.equals'),
};

let firstNumber = 0;
let operator = null;
let secondNumber = null;
let resultComputedWithEquals = false;

const operations = {
	add: (a, b) => a + b,
	subtract: (a, b) => a - b,
	multiply: (a, b) => a * b,
	divide: (a, b) => a / b,
};

function operate(operator, a, b) {
	switch (operator) {
		case '+':
			return operations.add(a, b);
		case '-':
			return operations.subtract(a, b);
		case '*':
			return operations.multiply(a, b);
		case '/':
			return operations.divide(a, b);
	}
}

function determineNewDisplayText(key) {
	const displayText = document.querySelector('.display-text').textContent;
	let newDisplayText;
	if (
		displayText === '0' ||
		resultComputedWithEquals ||
		(operator !== null && secondNumber === null)
	) {
		newDisplayText = key;
		resultComputedWithEquals = false;
	} else {
		newDisplayText = dom.displayText.textContent + key;
	}

	return newDisplayText;
}

dom.operators.forEach((domOperator) => {
	domOperator.addEventListener('click', (e) => {
		const key = e.currentTarget.dataset.key;

		if (operator === null && secondNumber === null) {
			operator = key;
			dom.activateOperator(key);
		} else if (operator !== null && secondNumber !== null) {
			const result = operate(operator, firstNumber, secondNumber);
			dom.updateDisplayText(result);
			firstNumber = result;
			operator = key;
			dom.activateOperator(key);
			secondNumber = null;
		}
	});
});

dom.numbers.forEach((domNumber) => {
	domNumber.addEventListener('click', (e) => {
		const key = e.currentTarget.dataset.key;
		const newDisplayText = determineNewDisplayText(key);
		const newNumber = Number.parseFloat(newDisplayText);

		if (operator === null || resultComputedWithEquals) {
			firstNumber = newNumber;
			resultComputedWithEquals = false;
		} else {
			secondNumber = newNumber;
		}

		dom.updateDisplayText(newDisplayText);
	});
});

dom.equals.addEventListener('click', () => {
	if (operator !== null && secondNumber !== null) {
		const displayText = dom.displayText.textContent;
		secondNumber = Number.parseFloat(displayText);
		const result = operate(operator, firstNumber, secondNumber);
		firstNumber = result;
		operator = null;
		dom.activateOperator(operator);
		secondNumber = null;
		dom.updateDisplayText(result);
		resultComputedWithEquals = true;
	}
});

'use strict';

const dom = {
	displayValue: document.querySelector('.js-display-value'),
	numbers: document.querySelectorAll('.js-number'),
};

let displayValue = '0';

function add(a, b) {
	return a + b;
}

function subtract(a, b) {
	return a - b;
}

function multiply(a, b) {
	return a * b;
}

function divide(a, b) {
	return a / b;
}

function operate(a, b, operator) {
	switch (operator) {
		case '+':
			return add(a, b);
		case '-':
			return subtract(a, b);
		case '*':
			return multiply(a, b);
		case '/':
			return divide(a, b);
	}
}

function handleNumberClick(event) {
	const value = event.target.dataset.value;

	if (displayValue === '0') {
		displayValue = value;
	} else {
		displayValue += value;
	}

	dom.displayValue.textContent = displayValue;
}

dom.numbers.forEach((number) =>
	number.addEventListener('click', handleNumberClick)
);

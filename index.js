'use strict';

const dom = {
	output: document.querySelector('.js-output'),
	numbers: document.querySelectorAll('.js-number'),
};

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
	const output = dom.output;
	const value = event.target.dataset.value;

	if (output.textContent === '0') {
		output.textContent = value;
	} else {
		output.textContent += value;
	}
}

dom.numbers.forEach((number) =>
	number.addEventListener('click', handleNumberClick)
);

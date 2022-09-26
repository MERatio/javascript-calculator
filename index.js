'use strict';

const dom = {
	output: document.querySelector('.js-output'),
	numbers: document.querySelectorAll('.js-number'),
};

let output = '0';

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

	if (output === '0') {
		output = value;
	} else {
		output += value;
	}

	dom.output.textContent = output;
}

dom.numbers.forEach((number) =>
	number.addEventListener('click', handleNumberClick)
);

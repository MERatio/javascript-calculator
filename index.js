'use strict';

const dom = {
	displayValue: document.querySelector('.js-display-value'),
	numbers: document.querySelectorAll('.js-number'),
	operators: document.querySelectorAll('.js-operator'),
	equal: document.querySelector('.js-equal'),
};

let displayValue = '0';
let firstOperand = null;
let operator = null;
let isStartingSecondOperand = false;

function roundTo2DecimalPlace(num) {
	return Math.round((num + Number.EPSILON) * 100) / 100;
}

function deactiveOperators() {
	dom.operators.forEach((domOperator) => {
		if (domOperator.classList.contains('key-operator-active')) {
			domOperator.classList.remove('key-operator-active');
		}
	});
}

function setAndActivateOperator(operatorValue) {
	deactiveOperators();

	operator = operatorValue;

	dom.operators.forEach((domOperator) => {
		if (domOperator.dataset.value === operatorValue) {
			domOperator.classList.add('key-operator-active');
		}
	});
}

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

	if (displayValue === '0' || isStartingSecondOperand) {
		displayValue = value;
		isStartingSecondOperand = false;
	} else {
		displayValue += value;
	}

	dom.displayValue.textContent = displayValue;
}

function handleOperatorClick(event) {
	if (displayValue === 'ERROR') {
		return;
	}

	const value = event.target.dataset.value;

	if (operator === null) {
		firstOperand = displayValue;
		setAndActivateOperator(value);
	} else {
		const operationResult = operate(
			parseFloat(firstOperand),
			parseFloat(displayValue),
			operator
		);

		if (Number.isFinite(operationResult)) {
			const roundedOperationResult = roundTo2DecimalPlace(operationResult);
			firstOperand = roundedOperationResult;
			setAndActivateOperator(value);
			displayValue = roundedOperationResult;
		} else {
			firstOperand = null;
			setAndActivateOperator(null);
			displayValue = 'ERROR';
		}

		dom.displayValue.textContent = displayValue;
	}

	isStartingSecondOperand = true;
}

function handleEqualClick(event) {
	if (operator === null || displayValue === 'ERROR') {
		return;
	}

	const operationResult = operate(
		parseFloat(firstOperand),
		parseFloat(displayValue),
		operator
	);

	if (Number.isFinite(operationResult)) {
		const roundedOperationResult = roundTo2DecimalPlace(operationResult);
		firstOperand = roundedOperationResult;
		displayValue = roundedOperationResult;
	} else {
		firstOperand = null;
		displayValue = 'ERROR';
	}

	setAndActivateOperator(null);
	dom.displayValue.textContent = displayValue;
	isStartingSecondOperand = true;
}

dom.numbers.forEach((domNumber) =>
	domNumber.addEventListener('click', handleNumberClick)
);

dom.operators.forEach((domOperator) =>
	domOperator.addEventListener('click', handleOperatorClick)
);

dom.equal.addEventListener('click', handleEqualClick);

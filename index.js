'use strict';

const dom = {
	displayValue: document.querySelector('.js-display-value'),
	clear: document.querySelector('.js-clear'),
	numbers: document.querySelectorAll('.js-number'),
	operators: document.querySelectorAll('.js-operator'),
	equal: document.querySelector('.js-equal'),
};

let displayValue = '0';
let firstOperand = null;
let operator = null;
let isComposingNumber = false;

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

function handleClearClick() {
	displayValue = '0';
	firstOperand = null;
	operator = null;
	isComposingNumber = false;
	dom.displayValue.textContent = displayValue;
	deactiveOperators();
}

function handleNumberClick(event) {
	const value = event.target.dataset.value;

	if (displayValue === '0' || isComposingNumber) {
		displayValue = value;
		isComposingNumber = false;
	} else {
		displayValue += value;
	}

	dom.displayValue.textContent = displayValue;
}

function handleOperatorClick(event) {
	if (displayValue === '-' || displayValue === 'ERROR') {
		return;
	}

	const value = event.target.dataset.value;

	if (value === '-' && displayValue !== '-') {
		if (displayValue === '0' || isComposingNumber) {
			displayValue = '-';
			dom.displayValue.textContent = displayValue;
			isComposingNumber = false;
			return;
		}
	}

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

	isComposingNumber = true;
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
	isComposingNumber = true;
}

dom.clear.addEventListener('click', handleClearClick);

dom.numbers.forEach((domNumber) =>
	domNumber.addEventListener('click', handleNumberClick)
);

dom.operators.forEach((domOperator) =>
	domOperator.addEventListener('click', handleOperatorClick)
);

dom.equal.addEventListener('click', handleEqualClick);

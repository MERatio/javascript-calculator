'use strict';

const dom = {
	displayValue: document.querySelector('.js-display-value'),
	clear: document.querySelector('.js-clear'),
	numbers: document.querySelectorAll('.js-number'),
	operators: document.querySelectorAll('.js-operator'),
	equal: document.querySelector('.js-equal'),
};

let firstOperand = null;
let operator = null;
let isStartingANumber = true;
let haveAns = false;

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

function setAndActivateOperator(newOperator) {
	operator = newOperator;

	deactiveOperators();

	dom.operators.forEach((domOperator) => {
		if (domOperator.dataset.value === newOperator) {
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
	firstOperand = null;
	setAndActivateOperator(null);
	isStartingANumber = true;
	haveAns = false;
	dom.displayValue.textContent = '0';
}

function handleNumberClick(event) {
	const newStrNum = event.target.dataset.value;

	if (isStartingANumber) {
		dom.displayValue.textContent = newStrNum;
		isStartingANumber = false;
	} else {
		dom.displayValue.textContent += newStrNum;
	}
}

function handleOperatorClick(event) {
	const displayValue = dom.displayValue.textContent;

	if (displayValue === '-' || displayValue === 'ERROR') {
		return;
	}

	const newOperator = event.target.dataset.value;

	if (newOperator === '-' && isStartingANumber && !haveAns) {
		dom.displayValue.textContent = '-';
		isStartingANumber = false;
		return;
	}

	if (operator === null) {
		firstOperand = displayValue;
		setAndActivateOperator(newOperator);
	} else {
		const operationResult = operate(
			parseFloat(firstOperand),
			parseFloat(displayValue),
			operator
		);

		if (Number.isFinite(operationResult)) {
			const roundedOperationResult = roundTo2DecimalPlace(operationResult);
			firstOperand = roundedOperationResult;
			setAndActivateOperator(newOperator);
			dom.displayValue.textContent = roundedOperationResult;
		} else {
			firstOperand = null;
			setAndActivateOperator(null);
			dom.displayValue.textContent = 'ERROR';
		}
	}

	isStartingANumber = true;
	haveAns = false;
}

function handleEqualClick(event) {
	const displayValue = dom.displayValue.textContent;

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
		dom.displayValue.textContent = roundedOperationResult;
	} else {
		firstOperand = null;
		dom.displayValue.textContent = 'ERROR';
	}

	haveAns = true;
	setAndActivateOperator(null);
}

dom.clear.addEventListener('click', handleClearClick);

dom.numbers.forEach((domNumber) =>
	domNumber.addEventListener('click', handleNumberClick)
);

dom.operators.forEach((domOperator) =>
	domOperator.addEventListener('click', handleOperatorClick)
);

dom.equal.addEventListener('click', handleEqualClick);

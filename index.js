'use strict';

const dom = {
	displayValue: document.querySelector('.js-display-value'),
	allClear: document.querySelector('.js-all-clear'),
	backspace: document.querySelector('.js-backspace'),
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

function reset() {
	firstOperand = null;
	setAndActivateOperator(null);
	isStartingANumber = true;
	haveAns = false;
	dom.displayValue.textContent = '0';
}

function handleAllClearClick() {
	reset();
}

function handleBackspaceClick() {
	const displayValue = dom.displayValue.textContent;
	switch (displayValue) {
		case '0':
			break;
		case '-':
			dom.displayValue.textContent = '0';
			isStartingANumber = true;
			break;
		case 'ERROR':
			reset();
			break;
		default:
			const newDisplayValue = displayValue.slice(0, -1);
			if (newDisplayValue === '') {
				dom.displayValue.textContent = '0';
				isStartingANumber = true;
			} else {
				dom.displayValue.textContent = newDisplayValue;
			}
	}
}

function handleNumberClick(event) {
	const newStrNum = event.target.dataset.value;

	if (isStartingANumber || dom.displayValue.textContent === '0') {
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

dom.allClear.addEventListener('click', handleAllClearClick);

dom.backspace.addEventListener('click', handleBackspaceClick);

dom.numbers.forEach((domNumber) =>
	domNumber.addEventListener('click', handleNumberClick)
);

dom.operators.forEach((domOperator) =>
	domOperator.addEventListener('click', handleOperatorClick)
);

dom.equal.addEventListener('click', handleEqualClick);

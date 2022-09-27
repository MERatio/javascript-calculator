'use strict';

const dom = {
	displayValue: document.querySelector('.js-display-value'),
	allClear: document.querySelector('.js-all-clear'),
	backspace: document.querySelector('.js-backspace'),
	numbers: document.querySelectorAll('.js-number'),
	operators: document.querySelectorAll('.js-operator'),
	equal: document.querySelector('.js-equal'),
	decimalPoint: document.querySelector('.js-decimal-point'),
};

let firstOperand = null;
let operator = null;
let isStartingANumber = true;

function determineDecimalPointDisabledAttr() {
	if (dom.displayValue.textContent.includes('.')) {
		dom.decimalPoint.setAttribute('disabled', '');
	} else {
		dom.decimalPoint.removeAttribute('disabled');
	}
}

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
		if (domOperator.dataset.key === newOperator) {
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
	dom.displayValue.textContent = '0';
	dom.decimalPoint.removeAttribute('disabled');
}

function handleAllClearClick() {
	reset();
}

function handleBackspaceClick() {
	const displayValue = dom.displayValue.textContent;
	if (isStartingANumber) {
		dom.displayValue.textContent = '0';
		dom.decimalPoint.removeAttribute('disabled');
	} else if (displayValue === '0') {
	} else if (displayValue === '-') {
		dom.displayValue.textContent = '0';
		isStartingANumber = true;
	} else if (displayValue === 'ERROR') {
		reset();
	} else if (displayValue.slice(-1) === '.') {
		dom.displayValue.textContent = displayValue.slice(0, -1);
		dom.decimalPoint.removeAttribute('disabled');
	} else {
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
	const newStrNum = event.target.dataset.key;

	if (isStartingANumber || dom.displayValue.textContent === '0') {
		isStartingANumber = false;
		dom.displayValue.textContent = newStrNum;
		dom.decimalPoint.removeAttribute('disabled');
	} else {
		dom.displayValue.textContent += newStrNum;
	}
}

function handleOperatorClick(event) {
	const displayValue = dom.displayValue.textContent;

	if (displayValue === '-' || displayValue === 'ERROR') {
		return;
	}

	const newOperator = event.target.dataset.key;

	if (newOperator === '-' && isStartingANumber) {
		dom.displayValue.textContent = '-';
		isStartingANumber = false;
		return;
	}

	if (operator === null) {
		firstOperand = displayValue;
		setAndActivateOperator(newOperator);
		dom.decimalPoint.removeAttribute('disabled');
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

		determineDecimalPointDisabledAttr();
	}

	isStartingANumber = true;
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
		isStartingANumber = true;
		setAndActivateOperator(null);
		determineDecimalPointDisabledAttr();
	} else {
		reset();
		dom.displayValue.textContent = 'ERROR';
	}
}

function handleDecimalPointClick() {
	const displayValue = dom.displayValue.textContent;

	if (displayValue === '-') {
		dom.displayValue.textContent = '-0.';
	} else if (isStartingANumber || displayValue === '0') {
		dom.displayValue.textContent = '0.';
	} else {
		dom.displayValue.textContent += '.';
	}

	isStartingANumber = false;
	dom.decimalPoint.setAttribute('disabled', '');
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

dom.decimalPoint.addEventListener('click', handleDecimalPointClick);

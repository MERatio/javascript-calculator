'use strict';

const dom = {
	display: document.querySelector('.display'),
	displayText: document.querySelector('.display-text'),
	allClear: document.querySelector('.all-clear'),
	backspace: document.querySelector('.backspace'),
	operators: document.querySelectorAll('.operator'),
	numbers: document.querySelectorAll('.number'),
	equals: document.querySelector('.equals'),
	decimalPoint: document.querySelector('.decimal-point'),
	activateOperator(operator) {
		const domPrevActiveOperator = document.querySelector('.operator.active');
		const domOperator = document.querySelector(`[data-key="${operator}"]`);
		if (domPrevActiveOperator) {
			domPrevActiveOperator.classList.remove('active');
		}
		if (domOperator) {
			domOperator.classList.add('active');
		}
	},
	updateDisplayText(text) {
		this.displayText.textContent = text;
		// Make the scroll flush to the right
		this.display.scrollLeft = this.display.scrollWidth;
	},
};

let mode;
let canPressOperator;
let canPressEquals;
let canPressDecimalPoint;
let firstNumber;
let operator;
let secondNumber;
let resultComputedWithEquals;
let hasError;

function init() {
	mode = 'insert first number';
	canPressOperator = true;
	canPressEquals = false;
	canPressDecimalPoint = true;
	firstNumber = 0;
	operator = null;
	secondNumber = null;
	resultComputedWithEquals = false;
	hasError = false;
	dom.displayText.textContent = '0';
	const activeOperator = document.querySelector('.operator.active');
	if (activeOperator) {
		activeOperator.classList.remove('active');
	}
}

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

	if (key === '.') {
		if (
			displayText === '0' ||
			(mode === 'insert second number' && secondNumber === null)
		) {
			newDisplayText = '0.';
		} else {
			newDisplayText = displayText + '.';
		}
		canPressDecimalPoint = false;
	} else {
		if (
			displayText === '0' ||
			(operator !== null && secondNumber === null) ||
			resultComputedWithEquals
		) {
			newDisplayText = key;
			resultComputedWithEquals = false;
		} else {
			newDisplayText = dom.displayText.textContent + key;
		}
	}

	return newDisplayText;
}

function handleNumberAndDecimalPointClick(e) {
	const key = e.currentTarget.dataset.key;

	if (hasError || (key === '.' && !canPressDecimalPoint)) {
		return;
	}

	const newDisplayText = determineNewDisplayText(key);
	const newNumber = Number.parseFloat(newDisplayText);

	if (mode === 'insert first number' || resultComputedWithEquals) {
		firstNumber = newNumber;
		resultComputedWithEquals = false;
	} else {
		secondNumber = newNumber;
		canPressOperator = true;
		canPressEquals = true;
	}

	dom.updateDisplayText(newDisplayText);
}

dom.allClear.addEventListener('click', init);

dom.backspace.addEventListener('click', () => {
	if (
		(operator !== null && secondNumber === null) ||
		hasError ||
		resultComputedWithEquals
	) {
		return init();
	}

	const displayText = dom.displayText.textContent;

	if (displayText === '0') {
		return;
	}

	if (displayText[displayText.length - 1] === '.') {
		canPressDecimalPoint = true;
	}

	let newDisplayText = displayText.slice(0, -1);
	if (newDisplayText === '') {
		newDisplayText = '0';
	}
	const newNumber = Number.parseFloat(newDisplayText);
	if (mode === 'insert first number') {
		firstNumber = newNumber;
	} else {
		secondNumber = newNumber;
	}
	dom.updateDisplayText(newDisplayText);
});

dom.operators.forEach((domOperator) => {
	domOperator.addEventListener('click', (e) => {
		if (hasError || !canPressOperator) {
			return;
		}

		const key = e.currentTarget.dataset.key;

		if (mode === 'insert first number') {
			operator = key;
			dom.activateOperator(key);
			mode = 'insert second number';
			canPressDecimalPoint = true;
		} else if (mode === 'insert second number') {
			const result = operate(operator, firstNumber, secondNumber);
			if (result === Infinity) {
				init();
				hasError = true;
				dom.updateDisplayText('ERROR');
			} else {
				firstNumber = result;
				dom.updateDisplayText(result);
				operator = key;
				dom.activateOperator(key);
				secondNumber = null;
				canPressEquals = false;
				if (result.toString().includes('.')) {
					canPressDecimalPoint = false;
				} else {
					canPressDecimalPoint = true;
				}
			}
		}

		canPressOperator = false;
	});
});

dom.numbers.forEach((domNumber) => {
	domNumber.addEventListener('click', handleNumberAndDecimalPointClick);
});

dom.equals.addEventListener('click', () => {
	if (hasError || !canPressEquals) {
		return;
	}

	const result = operate(operator, firstNumber, secondNumber);
	if (result === Infinity) {
		init();
		hasError = true;
		dom.updateDisplayText('ERROR');
	} else {
		firstNumber = result;
		operator = null;
		dom.activateOperator(operator);
		secondNumber = null;
		dom.updateDisplayText(result);
		resultComputedWithEquals = true;
	}

	mode = 'insert first number';
	canPressOperator = true;
	canPressEquals = false;
	if (result.toString().includes('.')) {
		canPressDecimalPoint = false;
	} else {
		canPressDecimalPoint = true;
	}
});

dom.decimalPoint.addEventListener('click', handleNumberAndDecimalPointClick);

init();

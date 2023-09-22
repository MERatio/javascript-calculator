'use strict';

const dom = {
	displayText: document.querySelector('.display-text'),
	numbers: document.querySelectorAll('.number'),
	updateDisplayText(str) {
		if (this.displayText.textContent === '0') {
			this.displayText.textContent = str;
		} else {
			this.displayText.textContent += str;
		}
	},
};

let operator = '*';
let firstNumber = 2;
let secondNumber = 6;

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

dom.numbers.forEach((number) => {
	number.addEventListener('click', (e) => {
		const key = e.currentTarget.dataset.key;
		dom.updateDisplayText(key);
	});
});

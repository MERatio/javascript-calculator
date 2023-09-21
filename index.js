'use strict';

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

console.log(operate(operator, firstNumber, secondNumber));

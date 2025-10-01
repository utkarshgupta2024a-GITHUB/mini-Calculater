// Global state variables
const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
};

// Function to update the calculator display
function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    display.value = calculator.displayValue;
}

updateDisplay();

// Function to handle digit input
function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;

    if (waitingForSecondOperand === true) {
        // Start a new operand
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        // Append digit to the current display value
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

// Function to handle decimal point input
function inputDecimal(dot) {
    // Prevent multiple decimals in one number
    if (calculator.waitingForSecondOperand === true) {
        calculator.displayValue = '0.';
        calculator.waitingForSecondOperand = false;
        return;
    }

    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }
}

// Function to handle operator input
function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    // If an operator is already set and waiting for a second operand, update the operator
    if (operator && calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator;
        return;
    }

    // Set the first operand if it's the first time
    if (firstOperand === null) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        // If an operator is set, calculate the result
        const result = performCalculation[operator](firstOperand, inputValue);

        // Limit the result to a reasonable number of decimal places
        calculator.displayValue = String(parseFloat(result.toFixed(7)));
        calculator.firstOperand = result;
    }

    // Set the operator and flag that we are waiting for the next number
    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
}

// Object containing calculation functions
const performCalculation = {
    '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
    '=': (firstOperand, secondOperand) => secondOperand // The equal sign just triggers the calculation
};

// Function to reset the calculator
function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
}

// Event listener for all button clicks
const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
    // Check if the clicked element is a button
    if (!event.target.matches('button')) {
        return;
    }

    const { value } = event.target;

    switch (value) {
        case '+':
        case '-':
        case '*':
        case '/':
        case '=':
            handleOperator(value);
            break;
        case '.':
            inputDecimal(value);
            break;
        case 'all-clear':
            resetCalculator();
            break;
        default:
            // Check if the value is a digit
            if (Number.isInteger(parseFloat(value))) {
                inputDigit(value);
            }
    }

    updateDisplay();
});
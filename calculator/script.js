
const currentDisplay = document.getElementById("current");
const previousDisplay = document.getElementById("previous");

let currentValue = "0";
let previousValue = "";
let operator = null;
let shouldReset = false;

function updateDisplay() {
    currentDisplay.textContent = currentValue;
    previousDisplay.textContent =
        previousValue && operator
            ? `${previousValue} ${operator}`
            : "";
}

function inputNumber(number) {
    if (shouldReset) {
        currentValue = number;
        shouldReset = false;
    } else if (currentValue === "0") {
        currentValue = number;
    } else {
        currentValue += number;
    }

    updateDisplay();
}

function inputDecimal() {
    if (shouldReset) {
        currentValue = "0";
        shouldReset = false;
    }

    if (!currentValue.includes(".")) {
        currentValue += ".";
    }

    updateDisplay();
}

function chooseOperator(selectedOperator) {
    if (operator && !shouldReset) {
        calculate();
    }

    previousValue = currentValue;
    operator = selectedOperator;
    shouldReset = true;
    updateDisplay();
}

function calculate() {
    if (!operator || shouldReset) return;

    const first = Number(previousValue);
    const second = Number(currentValue);
    let result;

    switch (operator) {
        case "+":
            result = first + second;
            break;
        case "-":
            result = first - second;
            break;
        case "*":
            result = first * second;
            break;
        case "/":
            if (second === 0) {
                currentValue = "Error";
                previousValue = "";
                operator = null;
                shouldReset = true;
                updateDisplay();
                return;
            }
            result = first / second;
            break;
        case "%":
            result = first % second;
            break;
        default:
            return;
    }

    currentValue = String(Number(result.toPrecision(12)));
    previousValue = "";
    operator = null;
    shouldReset = true;

    updateDisplay();
}

function clearCalculator() {
    currentValue = "0";
    previousValue = "";
    operator = null;
    shouldReset = false;
    updateDisplay();
}

function deleteNumber() {
    if (shouldReset || currentValue === "Error") {
        currentValue = "0";
        shouldReset = false;
    } else {
        currentValue = currentValue.slice(0, -1) || "0";
    }

    updateDisplay();
}

function changeSign() {
    if (currentValue === "0" || currentValue === "Error") return;

    currentValue = String(Number(currentValue) * -1);
    updateDisplay();
}

// Button events
document.querySelectorAll("[data-number]").forEach(button => {
    button.addEventListener("click", () => {
        inputNumber(button.dataset.number);
    });
});

document.querySelectorAll("[data-operator]").forEach(button => {
    button.addEventListener("click", () => {
        chooseOperator(button.dataset.operator);
    });
});

document.querySelectorAll("[data-action]").forEach(button => {
    button.addEventListener("click", () => {
        const action = button.dataset.action;

        switch (action) {
            case "clear":
                clearCalculator();
                break;
            case "delete":
                deleteNumber();
                break;
            case "decimal":
                inputDecimal();
                break;
            case "calculate":
                calculate();
                break;
            case "sign":
                changeSign();
                break;
        }
    });
});

// Keyboard support
document.addEventListener("keydown", event => {
    if (/^[0-9]$/.test(event.key)) {
        inputNumber(event.key);
    } else if (event.key === ".") {
        inputDecimal();
    } else if (["+", "-", "*", "/", "%"].includes(event.key)) {
        chooseOperator(event.key);
    } else if (event.key === "Enter" || event.key === "=") {
        calculate();
    } else if (event.key === "Backspace") {
        deleteNumber();
    } else if (event.key === "Escape") {
        clearCalculator();
    }
});

updateDisplay();

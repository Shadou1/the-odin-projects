// Relevant elements

const calculatorDiv = document.querySelector('#calculator')
const digitsDiv = document.querySelector('#digits')
const operatorsDiv = document.querySelector('#operators')
const extraOperatorsDiv = document.querySelector('#extra-operators')

const displayDiv = document.querySelector('#display')
const displayText = document.querySelector('#display-text')

const bigDisplay = document.querySelector('#big-d')
const displayTextOperand1 = document.querySelector('#display-operand1')
const displayTextOperand2 = document.querySelector('#display-operand2')
const displayTextOperator = document.querySelector('#display-operator')
const displayTextResult = document.querySelector('#display-result')

// Current operands, operator, result and other variables

let operand1 = ''
let operand2 = ''
let operator = ''

let result = ''
let chaining = false

let toggleBigD = false
let toggleWideD = false

const snarkySound = new Audio('sounds/privet.mp3')

const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.']

const operators = {
    'add': '+',
    'subtract': '-',
    'multiply': '×',
    'divide': '÷',
    'equals': '=',
    'remainder': '%',
}

const extraOperators = {
    'negate': '+/-',
    'power': '^',
    'backspace': '←',
    'clear': 'AC',
    'big_display': 'big',
    'wide_display': 'wide',
}

// Basic operators

function add(a, b) {
    return +a + +b
}

function subtract(a, b) {
    return a - b
}

function multiply(a, b) {
    return a * b
}

function divide(a, b) {
    if (b == 0) {
        doSomethingSnarky()
    }
    return a / b
}

function remainder(a, b) {
    return a % b
}

// Extra operators

// not actually used
function negate(a) {
    return -a
}

function power(a, b) {
    return Math.pow(a, b)
}

// Operate function

function operate(operator, a, b) {
    let result

    switch (operator) {
        case '+':
            result = add(a, b)
            break
        case '-':
            result = subtract(a, b)
            break
        case '*':
        case '×':
            result = multiply(a, b)
            break
        case '/':
        case '÷':
            result = divide(a, b)
            break
        case '%':
            result = remainder(a, b)
            break
        case '+/-':
            result = negate(a)
            break
        case '^':
            result = power(a, b)
            break
    }

    return result.toString()
}

// Generate calculator functions

function generateDigits() {
    for (i = 0; i < 10; i++) {
        const digit = document.createElement('button')
        digit.classList.add('button', 'button-digit')
        digit.setAttribute('data-digit', i)
        digit.style.gridArea = 'n' + i
        digit.innerText = i

        digitsDiv.appendChild(digit)
    }
    const period = document.createElement('button')
    period.classList.add('button', 'button-digit')
    period.setAttribute('data-digit', '.')
    period.style.gridArea = 'n'
    period.innerText = '.'

    digitsDiv.appendChild(period)
}

function generateDigits(digitsArray) {
    for (let digitNum of digitsArray) {
        const digit = document.createElement('button')
        digit.classList.add('button', 'button-digit')
        digit.setAttribute('data-digit', digitNum)
        digit.style.gridArea = 'n' + digitNum
        digit.innerText = digitNum

        digitsDiv.appendChild(digit)
    }
}

function generateOperators(operatorsObj, operatorsDivElement) {
    for (let operatorName of Object.keys(operatorsObj)) {
        const operator = document.createElement('button')
        operator.classList.add('button', 'button-operator')
        operator.setAttribute('data-operator', operatorsObj[operatorName])
        operator.style.gridArea = operatorName
        operator.innerText = operatorsObj[operatorName]

        operatorsDivElement.appendChild(operator)
    }
}

// Update display function
function updateDisplay(value = result) {

    if (!toggleWideD && value.toString().length > 12) value = (+value).toPrecision(8).toString()
    // else if (toggleWideD && value.toString().length > 23) value = value.toPrecision(23)

    // if (value < 0) displayText.value = value.toString().substr(1) + '-' 
    // else displayText.value = value
    displayText.value = value

    displayTextOperand1.value = operand1
    displayTextOperand2.value = operand2
    displayTextOperator.value = operator
    displayTextResult.value = result
}

// Update operand function
function updateOperand(operand, value) {

    if (value != '.') {
        if (!toggleWideD && operand.length < 12) return operand + value
        else if (toggleWideD && operand.length < 23) return operand + value
        else return operand
    } else {
        if (!operand.includes('.')) {
            return operand + value
        } else {
            return operand
        }
    }

}

// Button click callback function

// Function turned out quite complex and convoluted and for sure could've been much smaller
// In real calculators this is probably not how it works

// The way I realized it with only operand1, operand2, operator, and result variables I need to often check for
// whether these variables are set to process the click of a button accordingly. If I would've used more state variables,
// besides 'chaining' state variable, which would decide what I would do in a particular state of a calculator,
// the code would've been smaller and more readable

function processClick(e) {

    // If we clicked any digit
    if (e.target.classList.contains('button-digit')) {

        currentOperand = e.target.getAttribute('data-digit')

        // If no operator was supplied, concatenate to the first operand
        if (!operator) {

            operand1 = updateOperand(operand1, currentOperand)
            updateDisplay(operand1)

        // If there is result already
        } else if (result) {

            // If we are chaining operators (without clicking equals) reset result and reset second operand and
            // change current operator to clicked operator
            if (chaining) {

                operand2 = '' + currentOperand
                result = ''
                updateDisplay(operand2)

            // If we are not chaining, reset all variables like if we would clicked AC
            } else {

                operand1 = '' + currentOperand
                operand2 = ''
                operator = ''
                result = ''
                updateDisplay(operand1)

            }

        // If there is no result, which is when we didn't actually do any calculations yet, or if we
        // chained operand, concatenate to the second operand
        } else {

            operand2 = updateOperand(operand2, currentOperand)
            updateDisplay(operand2)

        }

    // If we clicked any operator
    } else if (e.target.classList.contains('button-operator')) {

        const currentOperator = e.target.getAttribute('data-operator')

        // If our operator is not special
        if (!Object.values(extraOperators).includes(currentOperator) && currentOperator != '=' || currentOperator == '^') {
            
            // If there is operand1 and no operand2, set current operator to clicked operator
            // Also set chaining to true
            if (operand1 && !operand2) {

                operator = currentOperator

                updateDisplay(operator)

                // If there is no operand2 yet, we need to get ready to chain operations
                // if we hit another operator after entering operand2
                if (!chaining) chaining = true
            
            // If we have operand1 and operand2 also, behave like if we hit equals, but reset operand2
            // so that we can start typing it with digit buttons
            } else if (operand2) {

                // If we are chaining, update result
                // The only situation when we are not chaining, is if we hit equals and then
                // hit any non special operator, then we do not want to update result because
                // we already updated it when we hit equals
                if (chaining) result = operate(operator, operand1, operand2)

                // Set operand 1 to result so that we can repeat this operation
                operand1 = result.toString()
                operand2 = ''
                operator = currentOperator

                // Set display to operator if we are not chaining
                if (chaining) updateDisplay(result)
                else updateDisplay(operator)

                // If we are not chaining, begin chaining so that if we click this
                // after clicking equals, and then click any digit it would not reset
                if (!chaining) chaining = true

            }

        } else if (currentOperator == '+/-') {

            // Stupid way to negate current operand
            // It will be negated only if it is currently displayed
            if (!Object.values(operators).includes(displayText.value.toString()) &&
                !Object.values(extraOperators).includes(displayText.value.toString())) {
                if (result) {
                    result = (-(+result)).toString()
                    operand1 = (-(+operand1)).toString()
                } else {
                    if (!operand2) {
                        operand1 = (-(+operand1)).toString()
                    } else {
                        operand2 = (-(+operand2)).toString()
                    }
                }

                const updateValue = result || operand2 || operator || operand1
                updateDisplay(updateValue)
            }

        // If we clicked equals
        } else if (currentOperator == '=') {

            // If there is operand1 and operand2, calulate and display result
            // Set chaining to false so that if we hit any digit it will act as if we would clicked AC
            // Clicking equals multiple times repeats previous operation
            if (operand1 && operand2) {

                result = operate(operator, operand1, operand2)
                // Set operand 1 to result so that we can repeat this operation
                operand1 = result.toString()
                updateDisplay(result)
                chaining = false

            }

        // If we cliked AC, reset all variables
        } else if (currentOperator == 'AC') {

            operand1 = ''
            operand2 = ''
            operator = ''
            result = ''
            updateDisplay(result)

        } else if (currentOperator == '←') {

            // Literally the same stupid code as with '+/-' operator
            if (!Object.values(operators).includes(displayText.value.toString()) &&
                !Object.values(extraOperators).includes(displayText.value.toString())) {
                if (result) {
                    result = result.slice(0, -1)
                    operand1 = operand1.slice(0, -1)
                } else {
                    if (!operand2) {
                        operand1 = operand1.slice(0, -1)
                    } else {
                        operand2 = operand2.slice(0, -1)
                    }
                }

                const updateValue = result || operand2 || operator || operand1
                updateDisplay(updateValue)
            }


        // Display bigger display with operand1, operand2, operator, and result displayed
        } else if (currentOperator == 'big') {

            toggleBigD = !toggleBigD
            if (toggleBigD) {
                bigDisplay.style.display = 'initial'
                calculatorDiv.style.height = '750px'
            } else {
                bigDisplay.style.display = 'none'
                calculatorDiv.style.height = '550px'
            }

        //Display wider display and longer numbers
        } else if (currentOperator =='wide') {

            toggleWideD = !toggleWideD
            if (toggleWideD) {
                calculatorDiv.style.width = '1000px'
            } else {
                calculatorDiv.style.width = '575px'
            }

            const updateValue = result || operand2 || operator || operand1
            updateDisplay(updateValue)

        }

    }
}

calculatorDiv.addEventListener('click', processClick)

function processKeyboard(e) {
    e.preventDefault()

    let button

    if (Object.values(operators).includes(e.key) || Object.values(extraOperators).includes(e.key)) {

        button = document.querySelector(`.button[data-operator='${e.key}']`)

    } else if (e.key == '*') {

        button = document.querySelector(`.button[data-operator='×']`)

    } else if (e.key == '/') {

        button = document.querySelector(`.button[data-operator='÷']`)

    } else if (digits.includes(e.key)) {

        button = document.querySelector(`.button[data-digit='${e.key}']`)

    } else if (e.keyCode == 8) {

        button = document.querySelector(`.button[data-operator='←']`)

    } else if (e.keyCode == 13) {

        button = document.querySelector(`.button[data-operator='=']`)

    }

    if (button) button.click()
}

window.addEventListener('keydown', processKeyboard)

function doSomethingSnarky() {
    const allElements = [...calculatorDiv.querySelectorAll('*.button, #display-text')]
    const someElements = allElements.filter(el => Math.random() > 0.8)

    for (let element of allElements) {
        // element.style.position = 'relative'
        element.style.pointerEvents = 'none'
        element.animate({
            opacity: [1, 0],
            visibility: ['visible', 'hidden'],
            // top: ['0px', Math.random() * 400 - 300 + 'px', Math.random() * 400 - 300 + 'px', Math.random() * 400 - 300 + 'px', '0px'],
            // left: ['0px', Math.random() * 200 - 100 + 'px', Math.random() * 200 - 100 + 'px', Math.random() * 200 - 100 + 'px', '0px'],
            // marginLeft: ['0px', Math.random() * 200 - 100 + 'px', Math.random() * 200 - 100 + 'px', Math.random() * 200 - 100 + 'px', '0px'],
            // marginRight: ['0px', Math.random() * 200 - 100 + 'px', Math.random() * 200 - 100 + 'px', Math.random() * 200 - 100 + 'px', '0px'],
            // marginBottom: ['0px', Math.random() * 200 - 100 + 'px', Math.random() * 200 - 100 + 'px', Math.random() * 200 - 100 + 'px', '0px'],
            // marginTop: ['0px', Math.random() * 200 - 100 + 'px', Math.random() * 200 - 100 + 'px', Math.random() * 200 - 100 + 'px', '0px'],
            // transform: [
            //     'translate(0px, 0px) rotate(0deg)',
            //     `translate(${Math.random() * 400 - 200}px, ${Math.random() * 400 - 200}px) rotate(${Math.random() * 720}deg) scale(${Math.random() * 10 - 5}, ${Math.random() * 10 - 5})`,
            //     `translate(${Math.random() * 400 - 200}px, ${Math.random() * 400 - 200}px) rotate(${Math.random() * 720}deg) scale(${Math.random() * 10 - 5}, ${Math.random() * 10 - 5})`,
            //     `translate(${Math.random() * 400 - 200}px, ${Math.random() * 400 - 200}px) rotate(${Math.random() * 720}deg) scale(${Math.random() * 10 - 5}, ${Math.random() * 10 - 5})`,
            //     'rotate(0deg)'],

        }, {duration: 1000, fill: 'forwards'})
    }

    // snarkySound.currentTime = 0
    snarkySound.play()
    window.removeEventListener('keydown', processKeyboard)

}

generateDigits(digits)
generateOperators(operators, operatorsDiv)
generateOperators(extraOperators, extraOperatorsDiv)
document.querySelector('[data-operator="+"]').classList.add('button-special')
document.querySelector('[data-operator="AC"]').classList.add('button-special')

updateDisplay()
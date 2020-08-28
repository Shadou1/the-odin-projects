# Calculator project for The Odin Project

The code does not reflect how real calculators work internally, so it turned out quite messy.

I needed to be able to react differently on user inputs based on what input it is and what is the current state of the calculator, meaning what is the currently entered operands and operator and other variables. I tried to do it with just `operand1`, `operand2`, `operator` and `result` variables, but I ended up adding `chaining` boolean variable to account for when user chains operations together. It was difficult to manage all user inputs with these variables only and as a consequence the code is not at all elegant and is repetitive at times. I was better off using more state variables like the `chaining` variable, but I decided to leave the code as is just to remind myself that limiting sometimes leads to a very lengthy code.

The `result` variable is used more as a state variable than as a variable to keep the result of an operation, cause as soon as the operation is performed, the result of this operation overrides the `operand1` variable.

I try to keep the operands and result as string variables internally, but there may be some excessive `.toString()` conversions performed.

I wanted to implement a calculator with these features in mind:
1. Calculator's buttons are generated in javascript.
2. If user clicks 'equals' button more than once, it will repeat the previous operation.
3. User can chain operations by clicking any operator instead of 'equals', i.e. 1 + 3 - 15 * 36 will work.
4. User can negate currently entered operand.
5. User can gradually erase currently entered operand.
6. User can enter floating point numbers.
7. Keyboard input can be used.

> You can check out this project on my [GitHub Pages](https://shadou1.github.io/the-odin-projects/web-development-101/calculator/). You can use your keyboard for inputs. Just don't try to *divide by zero*.

> This was made in one and a half days.
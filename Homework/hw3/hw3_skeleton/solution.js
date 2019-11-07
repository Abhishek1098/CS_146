var result, currentOP, buffer;
resetCalc();
/**
 * Resets the state of the calculator and the display
 */
function resetCalc() {
   result = 0;
   currentOP = '';
   buffer = 0;
   setDisplay(getResult());
}

/**
 * Sets the inner text of the div with id="output"
 * @param {String} str the string to set the inner text to
 */
function setDisplay(str) {
   var output = document.getElementById("output")
   output.innerHTML = '<div>' + str + '</div>';
}

/**
 * Returns the current result of the calculator
 * Hint: you can use a global variable for the result
 */
function getResult() {
   return result+'';
}

/**
 * Update the calculator state with the next number and sets the display
 * @param {Number} num the number that was pressed
 */
function pressNum(num) {
   var tryResult = result + '' + num;
   tryResult = Number(tryResult);
   if(tryResult > -999999999 && tryResult < 999999999) {
      result = tryResult;
   }
   setDisplay(getResult());
}

/**
 * Operation is pressed, move the current result value to a temporary buffer and
 * set the current result to zero.
 * @param {String} op the operation pressed, either: +,-,*,/
 */
function pressOp(op) {
   currentOP = op;
   if(result != 0) {
      buffer = result;
      result = 0;
   }
}

/**
 * Should compute the current operation with the buffer value and current
 * result value based on the current operation. If there is no current
 * operation, do nothing.
 */
function pressEquals() {
   var tryResult;
   if(currentOP == '+') {
      tryResult = result + buffer;
   } else if(currentOP == '-') {
      tryResult = result - buffer;
   } else if(currentOP == '*') {
      tryResult = result * buffer;
   } else if(currentOP == '/') {
      if(result != 0) {
         tryResult = buffer/result;
      } else {
         setDisplay("ERROR");
         return;
      }
   }
   if(tryResult > -999999999 && tryResult < 999999999) {
      result = tryResult;
   }
   setDisplay(getResult());
}
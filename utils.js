//  ------ All utility funtions are places inside here ------

/*
  When the user presses a key inside our input field, it will enter the function below. It
  will check if timeoutID is defined which it won't be so will carry onto the setTimeout function
  and set the timeoutID. With the next key pressed it will again enter the function below, but
  this time timeoutId is defined and will call the clearTimeout function using the timeoutId to
  stop the setTimeout currently being processed.

  This will carry on until the user doesn't make anymore key presses and the setTimeout has had
  time to execute and will call the fetchData using the users input onto the api to search for
  a result

  This is referred to as 'Debouncing an Input' - waiting for some time to pass after the last event
  to actually do something
*/

// helper function that returns a function - default delay 1s
const debounce = (func, delay = 1000) => {
  // ID for the setTimeout
  let timeoutId;
  // shield to protect against constant callbacks to the func - that can take multiple arguments
  // ...args is the same as writing arg1, arg2, arg3
  return (...args) => {
    // check to see if timeoutId is defined
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      // call the function as normal and take all the arguments in the array and pass them
      // in as separate arguments to the orginal function
      // func.apply is the same as func(arg1, arg2, arg3)
      func.apply(null, args);
    }, delay);
  };
};

// network request
const fetchData = async (searchTerm) => {
  // first argument in axios.get is the url we want to retrieve
  // ~ we have to wait for the response before we carry on with our code thats why
  //   we have the await keyword

  // we will get a response object back that represents all the information, related to this
  // request

  // second argument is an object
  const response = await axios.get("https://www.omdbapi.com/", {
    // list out all the different query string paramaters that we want to pass along with the
    // request

    // params below will be turned into a string and appended to the end of the url in the first
    // argument for axios
    params: {
      apikey: "1ca8cfc9",
      // s - used to perform a search request
      s: searchTerm,
      // i - to fetch an individual movie by id
      // i: "tt0848228",
    },
  });

  // data property from response holds all the data from the request
  console.log(response.data);
};

const input = document.querySelector("input");
// ID for the setTimeout
let timeoutId;
/*
  When the user presses a key inside our input field, it will enter the function below. It
  will check if timeoutID is defined which it won't be so will carry onto the setTimeout function
  and set the timeoutID. With the next key pressed it will again enter the function below, but
  this time timeoutId is defined and will call the clearTimeout function using the timeoutId to
  stop the setTimeout currently being processed.

  This will carry on until the user doesn't make anymore key presses and the setTimeout has had
  time to execute and will call the fetchData using the users input onto the api to search for
  a result
*/
const onInput = (event) => {
  // check to see if timeoutId is defined
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(() => {
    // this is how we have access to what the user has entered
    fetchData(event.target.value);
  }, 500);
};

// input event activates when the text inside the input changes
input.addEventListener("input", onInput);

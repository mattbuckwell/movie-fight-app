// ------ Autocomplete widget source code ------

/*
    Super reusable code to get an autocomplete to work. Zero knowledge of 'movies' or 'recipes'
    or 'blogs'. Must be able to be ran several times in the same project

    reference to movies or movie have been removed from this source code so the autocomplete
    widget can be reuseable for other applications outside of movie comparison as long as it
    is using the bulma css framework
*/

// destructoring out the functions being passed into from the application code
const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData,
}) => {
  // decoupling between html and js files for the search fields
  root.innerHTML = `
        <label><b>Search</b></label>
        <input class="input" />
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results">
                </div>
            </div>
        </div>
    `;

  const input = root.querySelector(".input");
  const dropdown = root.querySelector(".dropdown");
  const resultsWrapper = root.querySelector(".results");

  const onInput = async (event) => {
    /*
        because fetchData is an aync function we need to use await if we want to wait for the 
        promise to be fulfilled before storing it into our variable, becuase we used await we then
        also need to mark this function as async to allow this
        */
    const items = await fetchData(event.target.value);
    // if movies is empty then down run any code below, exit function
    if (!items.length) {
      dropdown.classList.remove("is-active");
      return;
    }
    // add some code to clear the dropdown menu so it doesn't double up
    resultsWrapper.innerHTML = "";
    // we are going to have a look at the dropdown element so we can activate the menu
    dropdown.classList.add("is-active");
    // iterating over the movies list from the api response
    for (let item of items) {
      // bulma requires anchor tags for elements inside the dropdown content
      const option = document.createElement("a");
      // for style purposes from bulma
      option.classList.add("dropdown-item");
      // to generator the html for this selected option we need to call rendorOption
      option.innerHTML = renderOption(item);
      // event listener for the input field when a user click a movie option the value is updated
      option.addEventListener("click", () => {
        dropdown.classList.remove("is-active");
        input.value = inputValue(item);
        onOptionSelect(item);
      });
      // adding the newly created anchor with our movie information to the dropdown content
      resultsWrapper.appendChild(option);
    }
  };

  // input event activates when the text inside the input changes and calls the debounce helper
  // function with an override delay of .5s
  input.addEventListener("input", debounce(onInput, 500));

  // code to handle closing the dropdown menu
  document.addEventListener("click", (event) => {
    /* 
        check to see if the element clicked is inside our search menu
        - if the user clicks inside or on the menu, stay open
        - if the user clicks outside of the menu, close the menu
        event.target - returns the element that has been clicked by the user
        */
    if (!root.contains(event.target)) {
      dropdown.classList.remove("is-active");
      // clearing the input field
      input.value = "";
    }
  });
};

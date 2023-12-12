/*
    Super reusable code to get an autocomplete to work. Zero knowledge of 'movies' or 'recipes'
    or 'blogs'. Must be able to be ran several times in the same project
*/

// function that takes expects to receive a root element
const createAutoComplete = ({ root }) => {
  // decoupling between html and js files for the search fields
  root.innerHTML = `
        <label><b>Search for a Movie</b></label>
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
    const movies = await fetchData(event.target.value);
    // if movies is empty then down run any code below, exit function
    if (!movies.length) {
      dropdown.classList.remove("is-active");
      return;
    }
    // add some code to clear the dropdown menu so it doesn't double up
    resultsWrapper.innerHTML = "";
    // we are going to have a look at the dropdown element so we can activate the menu
    dropdown.classList.add("is-active");
    // iterating over the movies list from the api response
    for (let movie of movies) {
      // bulma requires anchor tags for elements inside the dropdown content
      const option = document.createElement("a");
      // check to see if the img src is valid or not
      const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
      // for style purposes from bulma
      option.classList.add("dropdown-item");
      // backticks - allow for multiple line string
      // ${} to inject js variable into a string with backticks
      // double quote needed as only the url will be added to the img but it NEEDS to be a string
      option.innerHTML = `
            <img src="${imgSrc}" />
            ${movie.Title}
            `;
      // event listener for the input field when a user click a movie option the value is updated
      option.addEventListener("click", () => {
        dropdown.classList.remove("is-active");
        input.value = movie.Title;
        onMovieSelect(movie);
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

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

  // inspect the response data to make sure no error was returned from the API
  if (response.data.Error) {
    return [];
  }

  // return the Search array from the reponse against the API
  // - Search has a captial 'S' as that is how it is in the response, creator of API used capital
  return response.data.Search;
};

const root = document.querySelector(".autocomplete");
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

const input = document.querySelector(".input");
const dropdown = document.querySelector(".dropdown");
const resultsWrapper = document.querySelector(".results");

const onInput = async (event) => {
  /*
    because fetchData is an aync function we need to use await if we want to wait for the 
    promise to be fulfilled before storing it into our variable, becuase we used await we then
    also need to mark this function as async to allow this
  */
  const movies = await fetchData(event.target.value);
  // iterating over the movies list from the api response
  for (let movie of movies) {
    const div = document.createElement("div");
    // backticks - allow for multiple line string
    // ${} to inject js variable into a string with backticks
    // double quote needed as only the url will be added to the img but it NEEDS to be a string
    div.innerHTML = `
      <img src="${movie.Poster}" />
      <h1>${movie.Title}</h1>
    `;
    // adding the newly created div with our movie information to the div on our markup
    document.querySelector("#target").appendChild(div);
  }
};

// input event activates when the text inside the input changes and calls the debounce helper
// function with an override delay of .5s
input.addEventListener("input", debounce(onInput, 500));

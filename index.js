// ------ Application Specific Code ------

// reuseable code for the autocomplete widget
const autoCompleteConfig = {
  // helper function to show an individual item
  // - extracted some custom logic which is only appropriate for this movie related response,
  //   if we ever want to change what it looks like all we need to do is modify this
  renderOption(movie) {
    // check to see if the img src is valid or not
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    return `
      <img src="${imgSrc}" />
      ${movie.Title} (${movie.Year})
    `;
  },
  // what to back fill inside the input when a user clicks on a movie
  inputValue(movie) {
    return movie.Title;
  },
  // how to fetch the data from the API
  async fetchData(searchTerm) {
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
  },
};

// autocomplete widget configuration function call
createAutoComplete({
  // this means - make a copy of everything in the autoCompleteConfig object and throw it inside
  // this object as well as the root directory
  ...autoCompleteConfig,
  // where the autocomplete is to be rendered to
  root: document.querySelector("#left-autocomplete"),
  // what to do when someone clicks on an item
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#left-summary"), "left");
  },
});

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector("#right-autocomplete"),
  // what to do when someone clicks on an item
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#right-summary"), "right");
  },
});

// hold onto the reference to the selected movie so we can use for comparison later
let leftMovie;
let rightMovie;
// helper function to display information about selected movie
const onMovieSelect = async (movie, summaryElement, side) => {
  const response = await axios.get("https://www.omdbapi.com/", {
    params: {
      apikey: "1ca8cfc9",
      // i - to fetch an individual movie by id
      i: movie.imdbID,
    },
  });
  // calling the helper function with the response.data as the arg and saving it into the div
  // on the DOM
  summaryElement.innerHTML = movieTemplate(response.data);

  // for condition to see which side we are working with, left search or right
  if (side === "left") {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  // to check if both have been defined
  if (leftMovie && rightMovie) {
    // helper function
    runComparison();
  }
};

// helper function to run comparison on the movie selections
const runComparison = () => {
  // iterate over the element data-value values to compare
  const leftSideStats = document.querySelectorAll(
    "#left-summary .notification"
  );
  const rightSideStats = document.querySelectorAll(
    "#right-summary .notification"
  );

  // each callback element will be stored in 'leftStat' and index stored so we can
  // find the equilvilant in the right side
  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];

    const leftSideValue = leftStat.dataset.value;
    const rightSideValue = rightStat.dataset.value;

    // helping function? accepts 2 arguments and does the comparison
    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove("is-primary");
      leftStat.classList.add("is-warning");
    } else {
      rightStat.classList.remove("is-primary");
      rightStat.classList.add("is-warning");
    }
  });
};

// helper function to have all the html to display the details we need from the API
const movieTemplate = (movieDetail) => {
  // holding the value of box office, $ and commas have been removed
  const dollars = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
  );
  // holding the value of metascore
  const metascore = parseInt(movieDetail.Metascore);
  // holding the value of the imdb rating
  const imdbRating = parseFloat(movieDetail.imdbRating);
  //holding the value of the imdb voting, removed commas
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));
  // holding the values from the awards
  const awards = movieDetail.Awards.split(" ").reduce((prev, word) => {
    // how we can tell if we are working with a number or not, NaN if its a string
    const value = parseInt(word);
    if (isNaN(value)) {
      // return the current count
      return prev;
    } else {
      // add the int value to prev and return
      return prev + value;
    }
  }, 0);

  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article class="notification is-primary" data-value=${awards}>
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article class="notification is-primary" data-value=${dollars}>
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article class="notification is-primary" data-value=${metascore}>
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article class="notification is-primary" data-value=${imdbRating}>
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article class="notification is-primary" data-value=${imdbVotes}>
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};

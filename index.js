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

// we pass in the root element to create our autocomplete widget
createAutoComplete({
  root: document.querySelector(".autocomplete"),
  // helper function that gets passed in an object
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
});

// helper function to display information about selected movie
const onMovieSelect = async (movie) => {
  const response = await axios.get("https://www.omdbapi.com/", {
    params: {
      apikey: "1ca8cfc9",
      // i - to fetch an individual movie by id
      i: movie.imdbID,
    },
  });
  // calling the helper function with the response.data as the arg and saving it into the div
  // on the DOM
  document.querySelector("#summary").innerHTML = movieTemplate(response.data);
};

// helper function to have all the html to display the details we need from the API
const movieTemplate = (movieDetail) => {
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
    <article class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};

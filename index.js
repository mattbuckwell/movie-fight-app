// network request
const fetchData = async () => {
  // first argument in axios.get is the url we want to retrieve
  // ~ we have to wait for the response before we carry on with our code thats why
  //   we have the await keyword

  // we will get a response object back that represents all the information, related to this
  // request

  // second argument is an object
  const response = await axios.get("http://www.omdbapi.com/", {
    // list out all the different query string paramaters that we want to pass along with the
    // request

    // params below will be turned into a string and appended to the end of the url in the first
    // argument for axios
    params: {
      apikey: "1ca8cfc9",
      s: "avengers",
    },
  });

  // data property from response holds all the data from the request
  console.log(response.data);
};

fetchData();

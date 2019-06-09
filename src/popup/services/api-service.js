import optionsService from './options-service';

function createRequestOptions (apiKey, username) {
  return {
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      ApiKey: apiKey,
      UserName: username,
    },
  };
}

export async function search (movie, isRetry = false) {
  const { hostname, apiKey, username } = await optionsService.get();

  const options = createRequestOptions(apiKey, username);

  const response = await fetch(`${hostname}/api/v1/search/movie/${movie}`, options);
  const json = await response.json();

  if (!isRetry && Array.isArray(json) && !json.length) {
    // rotten tomatoes has a numeric identifier in the url for some movies
    // ex: https://www.rottentomatoes.com/m/1004567_commando
    // we cannot simply cut all numbers in the beginning since certain movies
    // have a valid number in the beginning as part of their name
    // ex: https://www.rottentomatoes.com/m/20000_leagues_under_the_sea_2002
    const alternateMovie = /(?:\d+\s)(.*)/i.exec(movie)[1];

    if (alternateMovie.length) {
      return await search(alternateMovie, true);
    }
  }

  return json;
}

export async function request (theMovieDbId) {
  const { hostname, apiKey, username } = await optionsService.get();

  const options = Object.assign({}, createRequestOptions(apiKey, username), {
    method: 'POST',
    body: JSON.stringify({
      theMovieDbId
    }),
  });

  const response = await fetch(`${hostname}/api/v1/request/movie/`, options);

  return await response.json();
}

export async function info (theMovieDbId) {
  const { hostname, apiKey, username } = await optionsService.get();

  const options = createRequestOptions(apiKey, username);

  const response = await fetch(`${hostname}/api/v1/search/movie/info/${theMovieDbId}`, options);

  return await response.json();
}

module.exports = {
  search,
  request,
  info,
};
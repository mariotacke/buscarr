import optionsService from './options-service';

function createRequestOptions (apiKey) {
  return {
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      ApiKey: apiKey,
    },
  };
}

export async function search (movie) {
  const { hostname, apiKey } = await optionsService.get();

  const options = createRequestOptions(apiKey);

  const response = await fetch(`${hostname}/api/v1/search/movie/${movie}`, options);

  return await response.json();
}

export async function request (theMovieDbId) {
  const { hostname, apiKey } = await optionsService.get();

  const options = Object.assign({}, createRequestOptions(apiKey), {
    method: 'POST',
    body: JSON.stringify({
      theMovieDbId
    }),
  });

  const response = await fetch(`${hostname}/api/v1/request/movie/`, options);

  return await response.json();
}

module.exports = {
  search,
  request,
};
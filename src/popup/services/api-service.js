import optionsService from './options-service';

async function createRequestOptions (apiKey) {
  return {
    headers: {
      'Content-Type': 'application/json',
      ApiKey: apiKey,
    },
  };
}

async function search (movie) {
  const { hostname, apiKey } = await optionsService.get();
  const options = await createRequestOptions(apiKey);
  const response = await fetch(`${hostname}/api/v1/search/movie/${movie}`, options);

  return await response.json();
}

module.exports = {
  search,
};
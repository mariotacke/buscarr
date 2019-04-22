const API_KEY = '';
const API_HOST = '';

const options = {
  headers: {
    'Content-Type': 'application/json',
    ApiKey: API_KEY,
  },
};

async function search (movie) {
  const response = await fetch(`${API_HOST}/api/v1/search/movie/${movie}`, options);

  return await response.json();
}

module.exports = {
  search,
};
import { getStoredValueAsync } from '../storage';

interface IOptions {
  hostname: string;
  apiKey: string;
  username: string;
  [key: string]: any;
}

export async function search(searchTerm: string, year?: number) {
  const { hostname, apiKey, username } = await getStoredValueAsync<IOptions>('options');

  let request: Promise<Response>;

  if (year) {
    request = fetch(`${hostname}/api/v1/search/movie`, {
      headers: {
        'Content-Type': 'application/json',
        ApiKey: apiKey,
        UserName: username,
      },
      method: 'POST',
      body: JSON.stringify({
        searchTerm: searchTerm,
        year: year,
      }),
    });
  } else {
    request = fetch(`${hostname}/api/v1/search/movie`, {
      headers: {
        'Content-Type': 'application/json',
        ApiKey: apiKey,
        UserName: username,
      },
      method: 'POST',
      body: JSON.stringify({
        searchTerm: searchTerm,
      }),
    });
  }

  const response = await request;
  const result = await response.json();

  console.debug(`Search Term: '${searchTerm}', Year: ${year}`);
  console.debug('Ombi search results', result);

  return result;
}

export async function request(theMovieDbId: string) {
  const { hostname, apiKey, username } = await getStoredValueAsync<IOptions>('options');

  const request: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ApiKey: apiKey,
      UserName: username,
    },
    method: 'POST',
    body: JSON.stringify({
      theMovieDbId,
    }),
  };

  const response = await fetch(`${hostname}/api/v1/request/movie/`, request);
  const result = await response.json();

  return result;
}

export async function info(theMovieDbId: string) {
  const { hostname, apiKey, username } = await getStoredValueAsync<IOptions>('options');

  const request: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ApiKey: apiKey,
      UserName: username,
    },
  };

  const response = await fetch(`${hostname}/api/v1/search/movie/info/${theMovieDbId}`, request);
  const result = await response.json();

  return result;
}
export const name = 'tmdb';

export const patterns = [
  /(?:https:\/\/)?www\.themoviedb\.org.*/
];

export function apply () {
  if (location.pathname.startsWith('/movie/')) {
    const titleText = document.getElementsByTagName('title')[0].innerText;

    // https://regex101.com/r/eU9Nyo/1
    const [, title, year] = /(.*)\s\((\d{4})\)/g.exec(titleText) || ['', '', ''];

    return {
      title,
      year: parseInt(year),
    };
  }

  return null;
}
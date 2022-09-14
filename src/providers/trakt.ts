export const name = 'trakt';

export const patterns = [
  /(?:https:\/\/)?trakt\.tv.*/
];

export function apply () {
  if (location.pathname.startsWith('/movies/')) {
    const titleText = document.getElementsByTagName('title')[0].innerText;

    // https://regex101.com/r/lwJIs3/1
    const [, title, year] = /(.*)\s\((\d{4})\)/g.exec(titleText) || ['', '', ''];

    return {
      title,
      year: parseInt(year),
    };
  }

  return null;
}
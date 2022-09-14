export const name = 'imdb';

export const patterns = [
  /(?:https:\/\/)?www\.imdb\.com.*/
];

export function apply () {
  if (location.pathname.startsWith('/title/')) {
    const titleText = document.getElementsByTagName('title')[0].innerText;

    // https://regex101.com/r/BEhQ6q/1
    const [, title, year] = /(.*)\s\((\d{4})\)/g.exec(titleText) || ['', '', ''];

    return {
      title,
      year: parseInt(year),
    };
  }

  return null;
}
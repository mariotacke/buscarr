import { MediaInformation } from '.';

export const hostname = 'www.imdb.com';

export const provider = (): MediaInformation | null => {
  if (location.pathname.startsWith('/title/')) {
    const titleText = document.getElementsByTagName('title')[0].innerText;

    // https://regex101.com/r/BEhQ6q/1
    const [, title, year] = /(.*)\s\((\d{4})\)/g.exec(titleText) || ['', '', ''];

    return {
      title,
      alternateTitles: [],
      year: parseInt(year),
    };
  }

  return null;
};
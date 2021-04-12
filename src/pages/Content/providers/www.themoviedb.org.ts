import { MediaInformation } from '.';

export const hostname = 'www.themoviedb.org';

export const provider = (): MediaInformation | null => {
  if (location.pathname.startsWith('/movie/')) {
    const titleText = document.getElementsByTagName('title')[0].innerText;

    // https://regex101.com/r/eU9Nyo/1
    const [, title, year] = /(.*)\s\((\d{4})\)/g.exec(titleText) || ['', '', ''];

    return {
      title,
      alternateTitles: [],
      year: parseInt(year),
    };
  }

  return null;
};

import { MediaInformation } from '.';

export const hostname = 'trakt.tv';

export const provider = (): MediaInformation | null => {
  if (location.pathname.startsWith('/movies/')) {
    const titleText = document.getElementsByTagName('title')[0].innerText;

    // https://regex101.com/r/lwJIs3/1
    const [, title, year] = /(.*)\s\((\d{4})\)/g.exec(titleText) || ['', '', ''];

    return {
      title,
      alternateTitles: [],
      year: parseInt(year),
    };
  }

  return null;
};
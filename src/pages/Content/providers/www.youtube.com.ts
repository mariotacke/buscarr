import { MediaInformation } from '.';

export const hostname = 'www.youtube.com';

const supportedExpressions = [
  /(?<title>.*?)\s?(?:".*")?(?: - )?(?:Exclusive Official Trailer)?(?:Official Trailer.*?)?(?:Official Movie Trailer.*?)?(?: Trailer.*?)? \(.*\s?(?<year>\d{4})\)/, // https://regex101.com/r/e0pHMj/4
];

export const provider = (): MediaInformation | null => {
  if (location.pathname.startsWith('/watch')) {
    // strategy 1: offer module / buy box information
    const offerModule = document.getElementById('offer-module');

    if (offerModule?.childNodes.length) {
      const title = offerModule.querySelector('#title')?.innerHTML;
      const year = offerModule.querySelector('#info p:nth-of-type(2) [title]')?.innerHTML;

      if (title && year) {
        return {
          title,
          alternateTitles: [],
          year: parseInt(year),
        };
      }
    }

    // strategy 2: parse video title
    const titleText = (document.querySelector('h1.title.ytd-video-primary-info-renderer') as HTMLElement).innerText || '';

    for (const expression of supportedExpressions) {
      const { title, year } = expression.exec(titleText)?.groups || {};

      if (title && year) {
        return {
          title,
          alternateTitles: [],
          year: parseInt(year),
        };
      }
    }
  }

  return null;
};
import { MediaInformation } from './providers';

export const hostname = 'www.rottentomatoes.com';

export const provider = (): MediaInformation | null => {
  if (location.pathname.startsWith('/m/')) {
    const [, name1, year1, name2] = /\/m\/(?:(\w+)_(\d{4})|(\w+))/g.exec(location.href) || ['', '', '', ''];

    const title = (name1 || name2 || '').replace(/_/g, ' ');
    const year = parseInt(year1) || null;

    // rotten tomatoes has a numeric identifier in the url for some movies
    // ex: https://www.rottentomatoes.com/m/1004567_commando
    // we cannot simply cut all numbers in the beginning since certain movies
    // have a valid number in the beginning as part of their name
    // ex: https://www.rottentomatoes.com/m/20000_leagues_under_the_sea_2002
    const [, alternateTitle] = /(?:\d+\s)(.*)/i.exec(title) || ['', ''];

    return {
      title,
      alternateTitles: [...(alternateTitle.length ? [alternateTitle] : [])],
      year,
    };
  }

  return null;
};
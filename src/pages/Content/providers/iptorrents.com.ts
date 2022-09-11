import { MediaInformation } from '.';

export const hostname = 'iptorrents.com';

export const provider = (): MediaInformation | null => {
  if (location.pathname.startsWith('/torrent.php')) {
    const title = (document.querySelector('#media .tt') as HTMLElement).innerText;
    const year = (document.querySelector('#media tbody tr:nth-child(3) td:nth-child(2)') as HTMLElement).innerText;

    return {
      title,
      alternateTitles: [],
      year: parseInt(year),
    };
  }

  return null;
};
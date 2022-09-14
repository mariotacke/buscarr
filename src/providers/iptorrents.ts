export const name = 'iptorrents';

export const patterns = [
  /(?:https:\/\/)?iptorrents\.com.*/
];

export function apply () {
  if (location.pathname.startsWith('/torrent.php')) {
    const title = (document.querySelector('#media .tt') as HTMLElement).innerText;
    const year = (document.querySelector('#media tbody tr:nth-child(3) td:nth-child(2)') as HTMLElement).innerText;

    return {
      title,
      year: parseInt(year),
    };
  }

  return null;
}
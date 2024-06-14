export const name = 'rottentomatoes';

export const patterns = [
  /(?:https:\/\/)?www\.rottentomatoes\.com.*/
];

export function apply () {
  if (location.pathname.startsWith('/m/')) {
    const titleText = document.getElementsByTagName('title')[0].innerText;

    // https://regex101.com/r/PcR1BH/1
    const [, title, year] = /(.*)(?:\s\((\d{4})\))? \| Rotten Tomatoes/g.exec(titleText) || ['', '', ''];

    return {
      title,
      year: parseInt(year),
    };
  }

  return null;
}
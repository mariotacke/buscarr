export const isChromeExtension = typeof chrome.storage !== 'undefined';
export const imageBaseUrl = 'https://image.tmdb.org/t/p/w200';

export function getYearFromUtcString (utcString) {
  return new Date(utcString).getFullYear();
}

export default {
  getYearFromUtcString,
}
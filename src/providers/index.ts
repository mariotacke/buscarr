import * as imdb from './imdb';
import * as iptorrents from './iptorrents';
import * as rottentomatoes from './rottentomatoes';
import * as tmdb from './tmdb';
import * as trakt from './trakt';
import * as youtube from './youtube';

const providers = [
  imdb,
  iptorrents,
  rottentomatoes,
  tmdb,
  trakt,
  youtube,
];

export function initialize (location: Location) {
  console.log(`Searching provider matching: ${location.hostname}`);

  const provider = providers.find((provider) => {
    return provider.patterns.some((pattern) => {
      return pattern.test(location.hostname);
    });
  });

  if (provider) {
    console.log(`Provider found for page: ${provider.name}`);
  } else {
    console.log(`No provider found for page.`);
  }

  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.from === 'popup' && message.subject === 'info') {
      // use text selection for one-off searches
      const selection = window.getSelection()?.toString();

      if (selection) {
        console.log(`Text selected. Using "${selection}" as search term`)
        return sendResponse({ title: selection });
      }

      if (!provider) {
        return sendResponse(null);
      }

      const content = provider.apply();

      return sendResponse(content);
    } else {
      return sendResponse(null);
    }
  });
}
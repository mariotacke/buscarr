import api from './api-service';
import { isChromeExtension } from '../lib/utils';

function triggerSearchResult (detail) {
  const event = new CustomEvent('search-result', { detail });

  window.dispatchEvent(event);
}

if (!isChromeExtension) {
  console.warn(`use window.manualTrigger('movie') to trigger a search.`);

  window.manualTrigger = async function (movie) {
    const result = await api.search(movie);

    triggerSearchResult(result);
  }
}

export async function queryTab () {
  if (isChromeExtension) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { from: 'popup', subject: 'info' }, async ({ movie }) => {
        const result = await api.search(movie);

        triggerSearchResult(result);
      });
    });
  }
}

export default {
  queryTab,
}
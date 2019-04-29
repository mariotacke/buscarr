import { isChromeExtension } from '../lib/utils';

const optionsKey = 'options';

async function get () {
  return new Promise((resolve) => {
    if (isChromeExtension) {
      chrome.storage.sync.get([optionsKey], function ({ options }) {
        return resolve(JSON.parse(options));
      });
    } else {
      const stringifiedOptions = localStorage.getItem(optionsKey);

      return resolve(JSON.parse(stringifiedOptions));
    }
  });
}

async function set (options = {}) {
  return new Promise((resolve) => {
    const stringifiedOptions = JSON.stringify(options);

    if (isChromeExtension) {
      chrome.storage.sync.set({ [optionsKey]: stringifiedOptions }, function () {
        return resolve();
      });
    } else {
      localStorage.setItem(optionsKey, stringifiedOptions);

      return resolve();
    }
  });
}

export default {
  get,
  set,
}
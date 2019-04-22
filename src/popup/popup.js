const { search } = require('../lib/api');

window.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { from: 'popup', subject: 'info' }, async function ({ movie }) {
      const result = await search(movie);
      const imageBaseUrl = 'https://image.tmdb.org/t/p/w200';

      const img = document.createElement('img');

      img.src = imageBaseUrl + result[0].posterPath;

      document.body.appendChild(img);
    });
  });
});
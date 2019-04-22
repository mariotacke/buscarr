chrome.runtime.sendMessage({ from: 'content', subject: 'showPageAction' });

chrome.runtime.onMessage.addListener(function (message, sender, callback) {
  if (message.from === 'popup' && message.subject === 'info') {
    const match = /\/m\/(?:(\w+)_(\d{4})|(\w+))/g.exec(location.href);
    const movie = (match[1] || match[3] || '').replace(/_/g, ' ');
    const year = match[2] || null;

    return callback({ movie, year });
  }
});
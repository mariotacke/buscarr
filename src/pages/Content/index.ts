import platformProviders from './providers';

// TODO: extension crashes when popup is open and page refresh/F5 is triggered
chrome.runtime.sendMessage(chrome.runtime.id, { from: 'content', subject: 'showPageAction' });

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.from === 'popup' && message.subject === 'info') {
    const provider = platformProviders[location.host];

    if (provider) {
      const content = provider();

      console.debug('Responding to', message.from, 'with', content);

      return sendResponse(content);
    } else {
      return sendResponse(null);
    }
  }

  sendResponse(null);
});
chrome.runtime.onMessage.addListener(function (message, sender) {
  if (message.from === 'content' && message.subject === 'showPageAction') {
    // @ts-ignore
    chrome.pageAction.show(sender.tab.id);
  }
});
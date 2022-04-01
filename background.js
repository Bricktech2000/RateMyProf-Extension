// https://stackoverflow.com/questions/23397757/chrome-extension-get-local-json-with-jquery
// https://developer.chrome.com/docs/extensions/reference/runtime/#method-getURL
// https://stackoverflow.com/questions/33144234/chrome-extension-geturl-not-working-in-injected-file
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/sendMessage
// https://stackoverflow.com/questions/48107746/chrome-extension-message-not-sending-response-undefined

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const url = chrome.runtime.getURL('processed.json');
  sendResponse(url);
});

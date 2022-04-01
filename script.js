window.addEventListener('load', async () => {
  console.log('extension loaded.');

  console.log('loading data...');
  chrome.runtime.sendMessage({}, async (url) => {
    const res = await fetch(url);
    const json = await res.json();

    console.log('replacing keys...');

    replaceOnDocument(Object.keys(json), 'PROF NAME REPLACED');

    console.log('done.');
  });
});

// https://stackoverflow.com/questions/18643766/find-and-replace-specific-text-characters-across-a-document-with-js
const replaceOnDocument = (
  patterns,
  string,
  { target = document.body } = {}
) => {
  // Handle `string` — see the last section
  [
    target,
    ...target.querySelectorAll('*:not(script):not(noscript):not(style)'),
  ].forEach(({ childNodes: [...nodes] }) =>
    nodes
      .filter(({ nodeType }) => nodeType === document.TEXT_NODE)
      .forEach((textNode) => {
        patterns.forEach((pattern) => {
          textNode.textContent = textNode.textContent.replaceAll(
            pattern,
            string
          );
        });
      })
  );
};

window.addEventListener('load', async () => {
  console.log('extension loaded.');

  console.log('loading data...');
  chrome.runtime.sendMessage({}, async (url) => {
    const res = await fetch(url);
    const json = await res.json();

    console.log('replacing keys...');

    replaceOnDocument(
      Object.keys(json),
      Object.values(json).map((value) => value.s / 5)
    );

    console.log('done.');
  });
});

// https://stackoverflow.com/questions/22015684/how-do-i-zip-two-arrays-in-javascript
const zip = (a, b) => a.map((k, i) => [k, b[i]]);

// https://stackoverflow.com/questions/18643766/find-and-replace-specific-text-characters-across-a-document-with-js
const replaceOnDocument = (
  patterns,
  strings,
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
        zip(patterns, strings).forEach(([pattern, string]) => {
          if (textNode.textContent.includes(pattern)) {
            textNode.parentNode.style.backgroundColor = `hsl(${
              string * (360 / 3)
            }, 100%, 50%)`;
          }
          // textNode.textContent = textNode.textContent.replaceAll(
          //   pattern,
          //   string
          // );
        });
      })
  );
};

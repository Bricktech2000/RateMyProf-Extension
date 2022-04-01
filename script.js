window.addEventListener('load', async () => {
  // const res = await fetch('processed.json');
  // const json = await res.json();

  console.log('extension loaded');
  // for (const [key, value] of Object.entries(json)) {
  for (const [key, value] of Object.entries({ code: 'asdf' })) {
    replaceOnDocument(new RegExp(key, 'gi'), 'PROF NAME REPLACED');
  }
});

// https://stackoverflow.com/questions/18643766/find-and-replace-specific-text-characters-across-a-document-with-js
const replaceOnDocument = (
  pattern,
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
      .forEach(
        (textNode) =>
          (textNode.textContent = textNode.textContent.replace(pattern, string))
      )
  );
};

replaceOnDocument(/€/g, '$');

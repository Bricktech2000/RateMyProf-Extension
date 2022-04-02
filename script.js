console.log('extension loaded.');

console.log('loading data...');
chrome.runtime.sendMessage({}, async (url) => {
  const res = await fetch(url);
  const json = await res.json();

  const run = async ({ target = document.body } = {}) => {
    // console.log('waiting...');
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('replacing keys...');

    replaceOnDocument(
      Object.keys(json),
      Object.entries(json).map(
        ([key, value]) =>
          `<span id="RateMyProfID" style="text-decoration: underline solid hsl(${
            (value.s / 5) * (360 / 3)
          }, 100%, 50%) 2px;">${key}</span>`
      ),
      { target }
    );
    console.log('done.');
  };

  const debouncedRun = debounce(run);

  // https://blog.sessionstack.com/how-javascript-works-tracking-changes-in-the-dom-using-mutationobserver-86adc7446401
  // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
  // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/MutationObserver

  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      // https://stackoverflow.com/questions/6518802/check-if-element-is-a-div
      if (
        mutation.target.id !== 'RateMyProfID' &&
        mutation.target.tagName !== '' // text node (maybe?)
      )
        debouncedRun();
    });
  });

  mutationObserver.observe(document, {
    childList: true,
    subtree: true,
  });

  debouncedRun();
});

// https://www.freecodecamp.org/news/javascript-debounce-example/
function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

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
    ...target.querySelectorAll('*:not(script):not(style):not(head)'),
  ].forEach(({ childNodes: [...nodes] }) =>
    nodes
      .filter(({ nodeType }) => nodeType === document.TEXT_NODE)
      .forEach((textNode) => {
        zip(patterns, strings).forEach(([pattern, string]) => {
          // if (textNode.textContent.includes(pattern)) {
          //   textNode.parentNode.style.backgroundColor = `hsl(${
          //     string * (360 / 3)
          //   }, 100%, 50%)`;
          // }

          // https://stackoverflow.com/questions/15553280/replace-a-textnode-with-html-text-in-javascript

          if (textNode.textContent.includes(pattern)) {
            var replacementNode = document.createElement('span');
            replacementNode.innerHTML = textNode.textContent.replaceAll(
              pattern,
              string
            );
            textNode.replaceWith(replacementNode);
          }
        });
      })
  );
};

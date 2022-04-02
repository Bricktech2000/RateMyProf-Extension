console.log('extension loaded.');

console.log('loading data...');
chrome.runtime.sendMessage({}, async (url) => {
  const res = await fetch(url);
  const json = await res.json();

  const run = async (target = document.body) => {
    console.log('replacing keys...');

    replaceOnDocument(
      Object.keys(json),
      Object.entries(json).map(
        ([key, value]) =>
          `<span id="RateMyProfID" style="text-decoration: underline solid hsl(${
            ((value.s - 1) / 4) * (360 / 3)
          }, 100%, 50%) 2px;">${key}</span>`
      ),
      target
    );
    console.log('done.');
  };

  const debouncedRun = debounceWithArgs(run);

  // https://blog.sessionstack.com/how-javascript-works-tracking-changes-in-the-dom-using-mutationobserver-86adc7446401
  // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
  // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/MutationObserver

  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      // https://stackoverflow.com/questions/6518802/check-if-element-is-a-div
      if (
        mutation.target.id !== 'RateMyProfID' &&
        mutation.target.tagName !== '' // text node (maybe?)
      ) {
        // console.log(mutation);
        const addedNodes = [...mutation.addedNodes].map((addedNode) => {
          addedNode.toJSON = function () {
            return `<${this.tagName}#${this.id}.${this.className}>`;
          };
          return addedNode;
        });
        debouncedRun(addedNodes);
      }
    });
  });

  mutationObserver.observe(document, {
    childList: true,
    subtree: true,
  });
});

// https://www.freecodecamp.org/news/javascript-debounce-example/
function debounceWithArgs(func, timeout = 300) {
  let timers = {};
  return (...args) => {
    // https://stackoverflow.com/questions/46880822/how-to-json-stringify-a-dom-element
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
    const hashableArgs = JSON.stringify(args); // JavaScript fun
    clearTimeout(timers[hashableArgs]);
    timers[hashableArgs] = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

// https://stackoverflow.com/questions/22015684/how-do-i-zip-two-arrays-in-javascript
const zip = (a, b) => a.map((k, i) => [k, b[i]]);

// https://stackoverflow.com/questions/18643766/find-and-replace-specific-text-characters-across-a-document-with-js
const replaceOnDocument = (patterns, strings, targets) => {
  targets.forEach((target) => {
    [
      target,
      ...(target.querySelectorAll
        ? target.querySelectorAll('*:not(script):not(style):not(head)')
        : []),
    ].forEach(({ childNodes: [...nodes] }) =>
      [target, ...nodes].forEach((textNode) => {
        if (textNode.nodeType === document.TEXT_NODE) {
          zip(patterns, strings).forEach(async ([pattern, string]) => {
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
        }
      })
    );
  });
};

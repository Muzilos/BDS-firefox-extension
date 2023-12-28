/*
 * This file is responsible for performing the logic of replacing
 * all occurrences of each mapped word with its word counterpart.
 */

/*global sortedWordMap*/

// wordMap.js defines the 'sortedWordMap' variable.
// Referenced here to reduce confusion.
const wordMap = sortedWordMap;

let regexs = new Map();
for (let word of wordMap.keys()) {
  regexs.set(word, new RegExp(word, 'gi'));
}

function isEditableElement(node) {
  return node.nodeName === 'TEXTAREA' || node.nodeName === 'INPUT' || node.isContentEditable;
}

function getCaretPosition(editableDiv) {
  let caretPos = 0;
  if (window.getSelection) {
    const range = window.getSelection().getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(editableDiv);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    caretPos = preCaretRange.toString().length;
  }
  return caretPos;
}

function setCaretPosition(editableDiv, position) {
  if (window.getSelection && document.createRange) {
    const range = document.createRange();
    range.selectNodeContents(editableDiv);
    range.setStart(editableDiv, position);
    range.collapse(true);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

function replaceText(node) {
  if (node.nodeType === Node.TEXT_NODE && !isEditableElement(node.parentNode)) {
    let content = node.textContent;

    for (let [word, replacement] of wordMap) {
      const regex = new RegExp(`\\b${word}\\b`, 'g');
      content = content.replace(regex, replacement);
    }

    node.textContent = content;
  } else if (!isEditableElement(node)) {
    for (let i = 0; i < node.childNodes.length; i++) {
      replaceText(node.childNodes[i]);
    }
  }
}

replaceText(document.body);

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes && mutation.addedNodes.length > 0) {
      for (let i = 0; i < mutation.addedNodes.length; i++) {
        const newNode = mutation.addedNodes[i];
        if (!isEditableElement(newNode)) {
          replaceText(newNode);
        }
      }
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// content.js
document.addEventListener('mouseup', () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText.length > 0) {
        chrome.storage.local.set({ selectedText }, () => {
            console.log('Text captured:', selectedText);
        });
    }
});

document.addEventListener('keyup', () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText.length > 0) {
        chrome.storage.local.set({ selectedText }, () => {
            console.log('Text captured:', selectedText);
        });
    }
});

// background.js
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "save-to-snipsage",
        title: "Save to SnipSage",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "save-to-snipsage") {
        const text = info.selectionText;
        chrome.storage.local.set({ 
            selectedText: text,
            sourceUrl: tab.url,
            pageTitle: tab.title
        }, () => {
            console.log('Text captured from context menu:', text);
            // Optionally notify the user or open the popup
        });
    }
});

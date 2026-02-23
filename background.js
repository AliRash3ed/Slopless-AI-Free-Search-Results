// Slopless: Background Script for Context Menus

function setupContextMenu(enabled) {
    chrome.contextMenus.removeAll(() => {
        if (enabled !== false) {
            chrome.contextMenus.create({
                id: "searchHumanEra",
                title: "Search in Human Era (Slopless)",
                contexts: ["selection"]
            });
        }
    });
}

// Initial setup
chrome.storage.local.get(['contextMenu'], (result) => {
    setupContextMenu(result.contextMenu);
});

// Handle toggle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "updateContextMenu") {
        setupContextMenu(request.state);
        sendResponse({ status: "success" });
    }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "searchHumanEra") {
        const query = info.selectionText;
        const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbs=cdr:1,cd_max:12/31/2019`;
        chrome.tabs.create({ url: url });
    }
});

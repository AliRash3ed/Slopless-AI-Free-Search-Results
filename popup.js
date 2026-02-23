// Slopless: Premium Search Engine (Restored Logic v2.4 with Custom Date)
let currentYear = "2022";

// Load saved settings
chrome.storage.local.get(['safeYear', 'hideAI', 'showBadges', 'contextMenu'], (result) => {
  if (result.safeYear) {
    currentYear = result.safeYear;
    const yearInput = document.getElementById('custom-year-input');
    if (yearInput) {
      yearInput.value = currentYear;
      toggleWarning(currentYear);
    }
  }

  // Additional Features - DEFAULT OFF
  document.getElementById('toggle-hide-ai').checked = result.hideAI === true;
  document.getElementById('toggle-badges').checked = result.showBadges === true;
  document.getElementById('toggle-context').checked = result.contextMenu === true;
});

function getCutoffDate(year) {
  // If year is 2022, keep theNov 30th specific date, otherwise use end of year
  if (year === "2022") return "11/30/2022";
  return `12/31/${year}`;
}

function getDDGDate(year) {
  if (year === "2022") return "2022-11-30";
  return `${year}-12-31`;
}

function performSearch(site) {
  const input = document.querySelector(`.search-input[data-site="${site}"]`);
  if (!input) return;

  const query = input.value.trim();
  if (!query) return;

  // Get value from custom year input
  const yearInput = document.getElementById('custom-year-input');
  const selectedYear = yearInput ? yearInput.value : currentYear;

  const dateStr = getCutoffDate(selectedYear);
  const ddgDate = getDDGDate(selectedYear);

  let url = "";

  switch (site) {
    case "google":
      url = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbs=cdr:1,cd_max:${dateStr}`;
      break;
    case "duckduckgo":
      url = `https://duckduckgo.com/?q=${encodeURIComponent(query)}&df=1990-01-01..${ddgDate}`;
      break;
    case "reddit":
      url = `https://www.google.com/search?q=site:reddit.com+${encodeURIComponent(query)}&tbs=cdr:1,cd_max:${dateStr}`;
      break;
    case "quora":
      url = `https://www.google.com/search?q=site:quora.com+${encodeURIComponent(query)}&tbs=cdr:1,cd_max:${dateStr}`;
      break;
    case "stackexchange":
      url = `https://www.google.com/search?q=site:stackexchange.com+${encodeURIComponent(query)}&tbs=cdr:1,cd_max:${dateStr}`;
      break;
    case "pinterest":
      url = `https://www.google.com/search?q=site:pinterest.com+${encodeURIComponent(query)}&tbs=cdr:1,cd_max:${dateStr}`;
      break;
    case "youtube":
      url = `https://www.google.com/search?q=site:youtube.com+${encodeURIComponent(query)}&tbs=cdr:1,cd_max:${dateStr}`;
      break;
  }

  if (url) {
    chrome.tabs.create({ url: url });
  }
}

function toggleWarning(year) {
  const warning = document.getElementById('ai-warning');
  if (warning) {
    warning.style.display = parseInt(year) > 2022 ? 'block' : 'none';
  }
}

// Year Input Listener
const customYearInput = document.getElementById('custom-year-input');
if (customYearInput) {
  customYearInput.addEventListener('change', (e) => {
    currentYear = e.target.value;
    toggleWarning(currentYear);
    chrome.storage.local.set({ safeYear: currentYear });
  });
}

document.querySelectorAll('.search-input').forEach(input => {
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch(input.dataset.site);
    }
  });
});

document.querySelectorAll('.search-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    performSearch(btn.dataset.site);
  });
});

// Settings Toggles
document.getElementById('toggle-hide-ai').addEventListener('change', (e) => {
  chrome.storage.local.set({ hideAI: e.target.checked });
});

document.getElementById('toggle-badges').addEventListener('change', (e) => {
  chrome.storage.local.set({ showBadges: e.target.checked });
});

document.getElementById('toggle-context').addEventListener('change', (e) => {
  chrome.storage.local.set({ contextMenu: e.target.checked });
  chrome.runtime.sendMessage({ action: "updateContextMenu", state: e.target.checked });
});

// Slopless: Content Script for Google Search Enhancement

function applySettings() {
    chrome.storage.local.get(['hideAI', 'showBadges', 'safeYear'], (result) => {
        const canHide = result.hideAI === true; // Default off
        const canBadge = result.showBadges === true; // Default off
        const selectedYear = result.safeYear || "2022";

        if (canHide) {
            hideAIElements();
        }

        if (canBadge) {
            addHumanBadges();
        }

        injectSloplessButton(selectedYear);
    });
}

function hideAIElements() {
    const aiSelectors = [
        '[data-as="1"]',
        'div[data-entityid="AI_OVERVIEW"]',
        '.MljYf',
        '.f67HWc',
        '.yPsnN'
    ];
    aiSelectors.forEach(sel => {
        const el = document.querySelector(sel);
        if (el) el.style.display = 'none';
    });
}

function injectSloplessButton(year) {
    const target = document.querySelector('#extabar') || document.querySelector('#top_nav');
    if (!target || document.querySelector('.slopless-injected-btn')) return;

    const btn = document.createElement('button');
    btn.className = 'slopless-injected-btn';
    btn.innerHTML = '⏳ GO TO BEFORE 2022 (NO AI ERA) OLD SEARCH RESULTS';
    btn.onclick = () => {
        const queryParams = new URLSearchParams(window.location.search);
        const query = queryParams.get('q');
        if (query) {
            const dateStr = (year === "2022") ? "11/30/2022" : `12/31/${year}`;
            window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbs=cdr:1,cd_max:${dateStr}`;
        }
    };

    target.prepend(btn);
}

function addHumanBadges() {
    const results = document.querySelectorAll('.g, .tF2Cxc');

    results.forEach(result => {
        const snippet = result.innerText;
        const dateMatch = snippet.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+\d{4}/i);

        if (dateMatch) {
            const date = new Date(dateMatch[0]);
            const cutoff = new Date('2022-11-30');

            if (date <= cutoff && !result.querySelector('.slopless-badge')) {
                const titleLink = result.querySelector('h3');
                if (titleLink) {
                    const badge = document.createElement('span');
                    badge.className = 'slopless-badge';
                    badge.innerHTML = '★ Verified Human Era';
                    titleLink.after(badge);
                }
            }
        }
    });
}

// Slopless: Safe Mutation Observer
const observer = new MutationObserver(() => applySettings());

function startObserving() {
    const targetNode = document.body || document.documentElement;
    if (targetNode) {
        observer.observe(targetNode, { childList: true, subtree: true });
        applySettings();
    } else {
        setTimeout(startObserving, 50);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserving);
} else {
    startObserving();
}

applySettings();

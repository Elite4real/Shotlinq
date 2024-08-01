document.getElementById('urlForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const urlInput = document.getElementById('url');
    const shortCodeInput = document.getElementById('shortCode');
    const longUrl = urlInput.value.trim();
    const shortCode = shortCodeInput.value.trim();

    if (!longUrl || !shortCode) {
        alert('Please provide both URL and short code.');
        return;
    }

    // Validate the short code to avoid conflicts
    let urlMappings = JSON.parse(localStorage.getItem('urlMappings')) || {};
    if (urlMappings[shortCode]) {
        alert('Short code already exists. Please choose a different one.');
        return;
    }

    const shortUrl = `${window.location.origin}/${shortCode}`;
    saveUrlMapping(shortCode, longUrl);
    updateLinkCount();

    document.getElementById('result').innerHTML = `
        <p class="font-bold text-lg">Shortened URL:</p>
        <a href="${shortUrl}" class="text-indigo-600" target="_blank">${shortUrl}</a>
        <button onclick="copyToClipboard('${shortUrl}')" class="mt-2 bg-indigo-600 text-white py-1 px-4 btn btn-primary">Copy generated link</button>
    `;
    urlInput.value = '';
    shortCodeInput.value = '';
    updateLinkCount();
});

function saveUrlMapping(shortCode, longUrl) {
    let urlMappings = JSON.parse(localStorage.getItem('urlMappings')) || {};
    urlMappings[shortCode] = longUrl;
    localStorage.setItem('urlMappings', JSON.stringify(urlMappings));
}

function updateLinkCount() {
    let urlMappings = JSON.parse(localStorage.getItem('urlMappings')) || {};
    let linkCount = Object.keys(urlMappings).length;

    document.getElementById('linkCount').innerText = linkCount;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Link copied to clipboard!');
    });
}

function redirectToLongUrl(shortCode) {
    let urlMappings = JSON.parse(localStorage.getItem('urlMappings')) || {};
    let longUrl = urlMappings[shortCode];

    if (longUrl) {
        window.location.href = longUrl;
    } else {
        console.error('URL not found');
    }
}

window.addEventListener('load', function() {
    updateLinkCount();

    const urlParams = new URLSearchParams(window.location.search);
    const shortCode = urlParams.get('code');

    if (shortCode) {
        redirectToLongUrl(shortCode);
    }
});

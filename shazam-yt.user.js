// ==UserScript==
// @name         Shazam - YouTube Music Button
// @namespace    https://supermartas.cz
// @version      1.0.1
// @description  Replace Apple Music button with YouTube Music on Shazam song pages
// @match        https://www.shazam.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @homepageURL  https://github.com/SuperMartas/shazam-yt
// @supportURL   https://github.com/SuperMartas/shazam-yt/issues
// @downloadURL  https://raw.githubusercontent.com/SuperMartas/shazam-yt/main/shazam-yt.user.js
// @updateURL    https://raw.githubusercontent.com/SuperMartas/shazam-yt/main/shazam-yt.user.js
// ==/UserScript==

(function () {
  'use strict';

  const MARKER = 'data-yt-music-injected';

  function getSongInfo() {
    const title = document.querySelector('[class*="NewTrackPageHeader_trackTitle"]');
    const artist = document.querySelector('[class*="TrackPageArtistLink_artistNameText"]');
    if (!title) return null;
    const parts = [title.textContent.trim()];
    if (artist) parts.push(artist.textContent.trim());
    return parts.join(' ');
  }

  function replaceButton() {
    const container = document.querySelector('[data-test-id="track_impression_open_in_apple_music"]');
    if (!container || container.querySelector(`[${MARKER}]`)) return false;

    const songQuery = getSongInfo();
    if (!songQuery || !songQuery.length) return false;

    // Capture class names from existing elements before replacing them
    const origLink = container.querySelector('a[class*="AppleMusicLink_link"]');
    const origWrapper = container.querySelector('div[class*="AppleMusicButton_buttonWrapper"]');
    const origLabel = container.querySelector('span[class*="Text-module_text"]');

    const ytMusicUrl = 'https://music.youtube.com/search?q=' + encodeURIComponent(songQuery);

    const link = document.createElement('a');
    link.href = ytMusicUrl;
    link.target = '_blank';
    link.rel = 'noopener';
    link.setAttribute('aria-label', 'Open in YouTube Music');
    link.setAttribute(MARKER, '');
    if (origLink) link.className = origLink.className;

    const wrapper = document.createElement('div');
    if (origWrapper) wrapper.className = origWrapper.className;

    const iconWrapper = document.createElement('div');
    iconWrapper.style.cssText = 'display:flex;align-items:center;justify-content:center;margin-right:6px;';
    iconWrapper.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" style="width:24px;height:24px;fill:#f03;">
      <circle cx="12" cy="12" r="6" fill="white"/><path d="M12 6.81c-2.86 0-5.19 2.33-5.19 5.19s2.33 5.19 5.19 5.19 5.19-2.33 5.19-5.19S14.86 6.81 12 6.81m-1.93 8.15V9.05L15.18 12l-5.11 2.95Z"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 15.92c-3.27 0-5.92-2.65-5.92-5.92S8.73 6.08 12 6.08s5.92 2.65 5.92 5.92-2.65 5.92-5.92 5.92"/>
    </svg>`;

    const label = document.createElement('span');
    if (origLabel) label.className = origLabel.className;
    label.textContent = 'Open in YouTube Music';

    wrapper.appendChild(iconWrapper);
    wrapper.appendChild(label);
    link.appendChild(wrapper);
    container.replaceChildren(link);

    return true;
  }

  let pending = null;
  const observer = new MutationObserver(() => {
    if (pending) return;
    pending = requestAnimationFrame(() => {
      pending = null;
      replaceButton();
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  replaceButton();
})();

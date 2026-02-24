// ==UserScript==
// @name         Shazam - YouTube Music Button
// @namespace    https://github.com/sm/shazam-yt
// @version      1.0
// @description  Replace Apple Music button with YouTube Music on Shazam song pages
// @match        https://www.shazam.com/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

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
    if (!container) return false;

    const songQuery = getSongInfo();
    if (!songQuery) return false;

    const ytMusicUrl = 'https://music.youtube.com/search?q=' + encodeURIComponent(songQuery);

    container.innerHTML = '';
    container.removeAttribute('data-test-id');

    const link = document.createElement('a');
    link.href = ytMusicUrl;
    link.target = '_blank';
    link.rel = 'noopener';
    link.setAttribute('aria-label', 'Open in YouTube Music');
    link.className = 'AppleMusicLink_link__MD7ZC AppleMusicButton_link__Yfxp4 AppleMusicButton_appleMusicButtonWrapper__C87WR';

    const wrapper = document.createElement('div');
    wrapper.className = 'AppleMusicButton_buttonWrapper__qFg_u';

    const iconWrapper = document.createElement('div');
    iconWrapper.style.cssText = 'display:flex;align-items:center;justify-content:center;margin-right:6px;';
    iconWrapper.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width:24px;height:24px;fill:#f03;">
      <circle cx="12" cy="12" r="6" fill="white"/><path d="M12 6.81c-2.86 0-5.19 2.33-5.19 5.19s2.33 5.19 5.19 5.19 5.19-2.33 5.19-5.19S14.86 6.81 12 6.81m-1.93 8.15V9.05L15.18 12l-5.11 2.95Z"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 15.92c-3.27 0-5.92-2.65-5.92-5.92S8.73 6.08 12 6.08s5.92 2.65 5.92 5.92-2.65 5.92-5.92 5.92"/>
    </svg>`;

    const label = document.createElement('span');
    label.className = 'Text-module_text-white__l-SDK Text-module_fontFamily__cQFwR Text-post-module_size-base__o144k Text-module_fontWeightNormal__kB6Wg';
    label.textContent = 'Open in YouTube Music';

    wrapper.appendChild(iconWrapper);
    wrapper.appendChild(label);
    link.appendChild(wrapper);
    container.appendChild(link);

    return true;
  }

  const observer = new MutationObserver(() => {
    replaceButton();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Also try immediately in case the element is already present
  replaceButton();
})();

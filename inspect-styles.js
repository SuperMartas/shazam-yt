// Run this in the browser console on a Shazam song page (e.g. https://www.shazam.com/song/...)
// It will log the computed styles of the Apple Music button elements so we can replicate them with inline styles.

(function () {
  const selectors = {
    container: '[data-test-id="track_impression_open_in_apple_music"]',
    link: '.AppleMusicLink_link__MD7ZC, a[class*="AppleMusicLink_link"]',
    buttonWrapper: 'div[class*="AppleMusicButton_buttonWrapper"]',
    label: 'span[class*="Text-module_text"]',
  };

  const interesting = [
    'display', 'flex-direction', 'align-items', 'justify-content',
    'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
    'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    'background', 'background-color',
    'border', 'border-radius',
    'color', 'font-size', 'font-weight', 'font-family', 'line-height',
    'text-decoration', 'text-align',
    'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
    'gap', 'cursor', 'opacity', 'box-shadow', 'overflow',
  ];

  const result = {};
  for (const [name, selector] of Object.entries(selectors)) {
    const el = document.querySelector(selector);
    if (!el) {
      result[name] = { _notFound: selector };
      continue;
    }
    const cs = getComputedStyle(el);
    const styles = {};
    for (const prop of interesting) {
      const val = cs.getPropertyValue(prop);
      if (val && val !== 'none' && val !== 'normal' && val !== '0px' && val !== 'auto') {
        styles[prop] = val;
      }
    }
    result[name] = styles;
  }
  const json = JSON.stringify(result, null, 2);
  console.log(json);
  copy(json);
  console.log('(Copied to clipboard)');
})();

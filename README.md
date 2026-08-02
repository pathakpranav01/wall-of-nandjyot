# Wall of Nandjyot — V9

Open `index.html` in a browser.

## V9 changes

- Immersive artwork viewer now requests true browser fullscreen when the device/browser supports the Fullscreen API.
- Keeps the existing full-viewport black viewer as a safe fallback where true fullscreen is unavailable (including browsers that restrict element fullscreen).
- Close control appears when an artwork opens, then fades away after ~2.2 seconds.
- Tap the artwork/viewer to reveal or hide the close control; tap × to exit.
- Escape still exits on desktop.
- Added a one-time automatic retry for gallery and viewer images if a browser briefly fails to fetch/decode an asset, reducing the chance of a broken-image/question-mark tile.
- Added version query strings to CSS/JS references to reduce stale browser-cache issues after deployment.
- Gallery layout, category filtering and V8 visual presentation are otherwise unchanged.

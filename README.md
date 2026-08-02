# Wall of Nandjyot — V10

Open `index.html` in a browser.

## V10 changes

- Reworked the immersive artwork viewer to request genuine fullscreen for the **whole document** rather than the overlay/dialog alone. This gives supporting mobile browsers the strongest standards-based request to hide browser chrome.
- Requests `navigationUI: "hide"` where the Fullscreen API supports it.
- Replaced the modal `<dialog>` viewer with a fixed, full-viewport overlay so it does not compete with the browser fullscreen top layer.
- Preserves the black full-viewport viewer as a fallback on browsers that refuse true fullscreen (notably iPhone/iPad browsers in many configurations).
- Artwork remains centred and uncropped at the maximum available size.
- Close control still auto-hides; tap the artwork to reveal/hide it.
- Browser/Android Back now closes the artwork viewer before navigating away from the gallery.
- Escape exits on desktop.
- Retains V9's one-time image retry protection for intermittent broken-image/question-mark loads.
- Bumped CSS/JS cache versions to V10.

## Platform note

A normal website can request true fullscreen but cannot force a browser to remove its own chrome when the OS/browser refuses the Fullscreen API. V10 uses the strongest normal-web implementation and falls back gracefully where that restriction applies.

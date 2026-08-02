const viewer = document.querySelector('#viewer');
const stage = document.querySelector('.viewer-stage');
const vimg = document.querySelector('#viewer-image');
const closeButton = document.querySelector('#close');
const immerseHint = document.querySelector('#immerse-hint');
let controlsTimer;
let retryingViewerImage = false;
let viewerHistoryEntry = false;

function showControls(autoHide = true) {
  viewer.classList.add('controls-visible');
  clearTimeout(controlsTimer);
  if (autoHide) controlsTimer = setTimeout(() => viewer.classList.remove('controls-visible'), 2200);
}

function hideControls() {
  clearTimeout(controlsTimer);
  viewer.classList.remove('controls-visible');
}

function fullscreenElement() {
  return document.fullscreenElement || document.webkitFullscreenElement || null;
}

async function enterFullscreen() {
  // Request fullscreen for the whole document, not just the artwork overlay.
  // This is the most reliable way to ask Android/desktop browsers to remove
  // their browser chrome while our fixed viewer is visible.
  const target = document.documentElement;
  try {
    if (target.requestFullscreen) {
      await target.requestFullscreen({ navigationUI: 'hide' });
      return true;
    }
    if (target.webkitRequestFullscreen) {
      target.webkitRequestFullscreen();
      return true;
    }
  } catch (_) {
    // iPhone/iPad browsers and some embedded/mobile browsers can refuse
    // element fullscreen. The fixed, full-viewport viewer remains the fallback.
  }
  return false;
}

async function exitFullscreen() {
  if (!fullscreenElement()) return;
  try {
    if (document.exitFullscreen) await document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
  } catch (_) {}
}

async function openViewer(image) {
  // Once a visitor has discovered the immersive viewer, the invitation has done its job.
  if (immerseHint) immerseHint.classList.add('is-dismissed');
  retryingViewerImage = false;
  vimg.src = image.currentSrc || image.src;
  vimg.alt = image.alt;
  viewer.hidden = false;
  viewer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('viewer-open');
  showControls(true);

  // Add one history entry so the browser/Android Back action closes the art
  // instead of unexpectedly navigating away from the gallery.
  if (!viewerHistoryEntry) {
    history.pushState({ artworkViewer: true }, '', location.href);
    viewerHistoryEntry = true;
  }

  // Keep this request in the original click gesture path. Browsers require
  // a user activation before they will enter genuine fullscreen.
  await enterFullscreen();
}

async function finishCloseViewer() {
  clearTimeout(controlsTimer);
  await exitFullscreen();
  viewer.hidden = true;
  viewer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('viewer-open');
  vimg.removeAttribute('src');
  hideControls();
}

async function closeViewer({ fromHistory = false } = {}) {
  if (viewer.hidden) return;
  if (!fromHistory && viewerHistoryEntry) {
    viewerHistoryEntry = false;
    history.back();
    return;
  }
  viewerHistoryEntry = false;
  await finishCloseViewer();
}

document.querySelectorAll('.art-button').forEach(button => {
  button.addEventListener('click', () => openViewer(button.querySelector('img')));
});

closeButton.addEventListener('click', e => {
  e.stopPropagation();
  closeViewer();
});

// Tap the artwork to bring back both the close control and © Nandjyot.
// If they are already visible, a tap lets the artwork become clean immediately.
stage.addEventListener('click', () => {
  if (viewer.classList.contains('controls-visible')) hideControls();
  else showControls(true);
});

viewer.addEventListener('click', e => {
  if (e.target === viewer) {
    if (viewer.classList.contains('controls-visible')) hideControls();
    else showControls(true);
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !viewer.hidden) closeViewer();
});

window.addEventListener('popstate', () => {
  if (!viewer.hidden) closeViewer({ fromHistory: true });
});

// If fullscreen is exited by the browser gesture/OS control, keep the viewer
// open in its clean full-viewport fallback rather than closing the artwork.
document.addEventListener('fullscreenchange', () => {
  if (!viewer.hidden && !fullscreenElement()) viewer.classList.add('fullscreen-fallback');
});
document.addEventListener('webkitfullscreenchange', () => {
  if (!viewer.hidden && !fullscreenElement()) viewer.classList.add('fullscreen-fallback');
});

// If a browser momentarily fails to decode/fetch a gallery image, retry once.
document.querySelectorAll('.art-button img').forEach(image => {
  image.addEventListener('error', () => {
    if (image.dataset.retried === 'true') return;
    image.dataset.retried = 'true';
    const original = image.getAttribute('src').split('?')[0];
    image.src = `${original}?retry=${Date.now()}`;
  });
});

vimg.addEventListener('error', () => {
  if (retryingViewerImage || !vimg.src) return;
  retryingViewerImage = true;
  const url = new URL(vimg.src, window.location.href);
  url.searchParams.set('retry', Date.now());
  vimg.src = url.href;
});

document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach(x => x.classList.remove('active'));
  button.classList.add('active');
  const filter = button.dataset.filter;
  document.querySelectorAll('.piece').forEach(piece => {
    const kinds = piece.dataset.kind.split(/\s+/);
    piece.classList.toggle('is-hidden', filter !== 'all' && !kinds.includes(filter));
  });
}));

// V11: discourage casual image saving without placing a watermark over the art.
document.addEventListener('contextmenu', e => {
  if (e.target.closest('.art-button img, #viewer-image')) e.preventDefault();
});
document.addEventListener('dragstart', e => {
  if (e.target.closest('.art-button img, #viewer-image')) e.preventDefault();
});

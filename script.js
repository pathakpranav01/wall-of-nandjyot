const viewer = document.querySelector('#viewer');
const stage = document.querySelector('.viewer-stage');
const vimg = document.querySelector('#viewer-image');
const closeButton = document.querySelector('#close');
let controlsTimer;
let retryingViewerImage = false;

function showControls(autoHide = true) {
  viewer.classList.add('controls-visible');
  clearTimeout(controlsTimer);
  if (autoHide) controlsTimer = setTimeout(() => viewer.classList.remove('controls-visible'), 2200);
}

function hideControls() {
  clearTimeout(controlsTimer);
  viewer.classList.remove('controls-visible');
}

async function enterFullscreen() {
  const target = viewer;
  const request = target.requestFullscreen || target.webkitRequestFullscreen;
  if (!request) return;
  try {
    await request.call(target, { navigationUI: 'hide' });
  } catch (_) {
    // Some mobile browsers (notably iPhone Safari) do not allow element fullscreen.
    // The dialog already provides a full-viewport fallback.
  }
}

async function exitFullscreen() {
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
  if (!fullscreenElement) return;
  const exit = document.exitFullscreen || document.webkitExitFullscreen;
  if (exit) {
    try { await exit.call(document); } catch (_) {}
  }
}

async function openViewer(image) {
  retryingViewerImage = false;
  vimg.src = image.currentSrc || image.src;
  vimg.alt = image.alt;
  viewer.showModal();
  showControls(true);
  await enterFullscreen();
}

async function closeViewer() {
  clearTimeout(controlsTimer);
  await exitFullscreen();
  if (viewer.open) viewer.close();
  vimg.removeAttribute('src');
}

document.querySelectorAll('.art-button').forEach(button => {
  button.addEventListener('click', () => openViewer(button.querySelector('img')));
});

closeButton.addEventListener('click', e => {
  e.stopPropagation();
  closeViewer();
});

// A tap on the artwork/stage reveals or hides the unobtrusive close control.
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
  if (e.key === 'Escape' && viewer.open) closeViewer();
});

// If a browser momentarily fails to decode/fetch a gallery image, retry it once
// with a cache-busting query instead of leaving a broken-image/question-mark tile.
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

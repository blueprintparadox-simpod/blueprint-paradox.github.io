/* =====================================================
   GLOBAL STATE
   ===================================================== */

let allAssets = [];
let currentSlide = 0;

/* =====================================================
   DOM READY
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  loadAssets();
  setupFilters();
  setupEscKey();
});

/* =====================================================
   LOAD ASSETS & CREATE GRID
   ===================================================== */

function loadAssets() {
  fetch('assets.json')
    .then(response => response.json())
    .then(assets => {
      allAssets = assets;
      const grid = document.getElementById('asset-grid');
      grid.innerHTML = '';

      assets.forEach(asset => {
        const card = document.createElement('div');
        card.className = 'asset-card';
        card.dataset.category = asset.category || 'Other';

        card.innerHTML = `
          <img class="asset-thumb" src="${asset.cover}" alt="${asset.title}">
          <h3>${asset.title}</h3>
          <p>${asset.shortDescription}</p>
        `;

        card.addEventListener('click', () => openAsset(asset.id));
        grid.appendChild(card);
      });
    })
    .catch(err => {
      console.error('Failed to load assets.json', err);
    });
}

/* =====================================================
   MODAL / ASSET DETAIL
   ===================================================== */

function openAsset(assetId) {
  const asset = allAssets.find(a => a.id === assetId);
  if (!asset) return;

  currentSlide = 0;

  const images =
    asset.screenshots && asset.screenshots.length > 0
      ? asset.screenshots
      : [asset.cover];

  const modalBody = document.getElementById('modal-body');

  modalBody.innerHTML = `
    <h2>${asset.title}</h2>
    <p>${asset.longDescription || ''}</p>

    <div class="slider">
      <button class="slider-btn left" id="slider-prev">‹</button>

      <div class="slider-track">
        ${images.map(img => `<img src="${img}" class="slide">`).join('')}
      </div>

      <button class="slider-btn right" id="slider-next">›</button>
    </div>

    <div class="slider-dots">
      ${images.map((_, i) =>
        `<div class="slider-dot ${i === 0 ? 'active' : ''}"></div>`
      ).join('')}
    </div>

    <div class="modal-links">
      ${
        asset.unityLink
          ? `<a href="${buildAffiliateLink(asset.unityLink, asset.id)}" target="_blank">
               View on Unity Asset Store
             </a>`
          : ''
      }
      ${
        asset.docsLink
          ? `<a href="${asset.docsLink}" target="_blank">Documentation</a>`
          : ''
      }
      ${
        asset.changelogLink
          ? `<a href="${asset.changelogLink}" target="_blank">Changelog</a>`
          : ''
      }
    </div>
  `;

  const modal = document.getElementById('asset-modal');
  modal.classList.remove('hidden');
  document.body.classList.add('modal-open');

  document.getElementById('modal-close').onclick = closeModal;
  document.querySelector('.modal-backdrop').onclick = closeModal;
  document.getElementById('slider-prev').onclick = prevSlide;
  document.getElementById('slider-next').onclick = nextSlide;

  updateSlider();
}

function closeModal() {
  document.getElementById('asset-modal').classList.add('hidden');
  document.body.classList.remove('modal-open');
}

/* =====================================================
   SLIDER LOGIC
   ===================================================== */

function updateSlider() {
  const track = document.querySelector('.slider-track');
  if (!track) return;

  track.style.transform = `translateX(-${currentSlide * 100}%)`;

  const dots = document.querySelectorAll('.slider-dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function prevSlide() {
  const slides = document.querySelectorAll('.slide');
  if (!slides.length) return;

  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  updateSlider();
}

function nextSlide() {
  const slides = document.querySelectorAll('.slide');
  if (!slides.length) return;

  currentSlide = (currentSlide + 1) % slides.length;
  updateSlider();
}

/* =====================================================
   FILTERS (FIXED)
   ===================================================== */

function setupFilters() {
  const buttons = document.querySelectorAll('.asset-filters button');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter.toLowerCase();

      // UI state
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filtering
      document.querySelectorAll('.asset-card').forEach(card => {
        const category = (card.dataset.category || '').toLowerCase();

        const visible =
          filter === 'all' || category === filter;

        card.style.display = visible ? 'block' : 'none';
      });
    });
  });
}

/* =====================================================
   ESC KEY
   ===================================================== */

function setupEscKey() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
}

/* =====================================================
   AFFILIATE LINK BUILDER
   ===================================================== */

function buildAffiliateLink(url, clickedAssetName) {
  const CAM_REF = "1101l4h3BC";
  const PUB_REF = "publisher_website";

  if (!url) return "";

  let cleanUrl = url;
  if (cleanUrl.startsWith("https://")) {
    cleanUrl = cleanUrl.substring(8);
  }

  return (
    "https://prf.hn/click/" +
    `camref:${CAM_REF}` +
    `/pubref:${PUB_REF}` +
    `/ar:${clickedAssetName}` +
    `/destination:https://${cleanUrl}`
  );
}

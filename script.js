let allAssets = [];
let currentSlide = 0;

/* =========================
   LOAD ASSETS & GRID
   ========================= */

fetch('assets.json')
  .then(response => response.json())
  .then(assets => {
    allAssets = assets;
    const grid = document.getElementById('asset-grid');

    assets.forEach(asset => {
      const card = document.createElement('div');
      card.className = 'asset-card';

      card.innerHTML = `
        <img class="asset-thumb" src="${asset.cover}" alt="${asset.title}">
        <h3>${asset.title}</h3>
        <p>${asset.shortDescription}</p>
      `;

      card.onclick = () => openAsset(asset.id);
      grid.appendChild(card);
    });
  })
  .catch(err => {
    console.error('Failed to load assets.json', err);
  });

/* =========================
   MODAL / DETAIL
   ========================= */

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

  // Bind modal controls (NOW DOM EXISTS)
  document.getElementById('modal-close').onclick = closeModal;
  document.querySelector('.modal-backdrop').onclick = closeModal;

  document.getElementById('slider-prev').onclick = prevSlide;
  document.getElementById('slider-next').onclick = nextSlide;

  updateSlider();
}

function closeModal() {
  document.getElementById('asset-modal').classList.add('hidden');
}

/* =========================
   SLIDER LOGIC
   ========================= */

function updateSlider() {
  const track = document.querySelector('.slider-track');
  if (!track) return;

  track.style.transform = `translateX(-${currentSlide * 100}%)`;
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

/* =========================
   AFFILIATE LINK BUILDER
   ========================= */

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

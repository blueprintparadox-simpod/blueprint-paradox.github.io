let allAssets = [];

fetch('assets.json')
  .then(r => r.json())
  .then(assets => {
    allAssets = assets;
    const grid = document.getElementById('asset-grid');

    assets.forEach(asset => {
      const card = document.createElement('div');
      card.className = 'asset-card';

      card.innerHTML = `
        <img class="asset-thumb" src="${asset.cover}">
        <h3>${asset.title}</h3>
        <p>${asset.shortDescription}</p>
      `;

      card.onclick = () => openAsset(asset.id);
      grid.appendChild(card);
    });
  });

function openAsset(id) {
  const asset = allAssets.find(a => a.id === id);
  const body = document.getElementById('modal-body');
  const images = asset.screenshots?.length
  ? asset.screenshots
  : [asset.cover];

body.innerHTML = `
  <h2>${asset.title}</h2>
  <p>${asset.longDescription}</p>

  <div class="slider">
    <button class="slider-btn left" onclick="prevSlide()">‹</button>
    <div class="slider-track">
      ${images.map(img => `<img src="${img}" class="slide">`).join('')}
    </div>
    <button class="slider-btn right" onclick="nextSlide()">›</button>
  </div>

  <div class="modal-links">
    <a href="${buildAffiliateLink(asset.unityLink, asset.id)}" target="_blank">
      View on Unity Asset Store
    </a>
    <a href="${asset.docsLink}" target="_blank">Documentation</a>
    <a href="${asset.changelogLink}" target="_blank">Changelog</a>
  </div>
`;

  document.getElementById('asset-modal').classList.remove('hidden');
}

document.getElementById('modal-close').onclick = closeModal;
document.querySelector('.modal-backdrop').onclick = closeModal;

function closeModal() {
  document.getElementById('asset-modal').classList.add('hidden');
}

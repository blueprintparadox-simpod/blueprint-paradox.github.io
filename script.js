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

  body.innerHTML = `
    <h2>${asset.title}</h2>
    <p>${asset.longDescription}</p>

    ${asset.screenshots?.map(img => `<img src="${img}">`).join('') || ''}

    <div class="modal-links">
      <a href="${asset.unityLink}" target="_blank">View on Unity Asset Store</a>
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

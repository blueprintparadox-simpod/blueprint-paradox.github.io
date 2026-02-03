fetch('assets.json')
  .then(response => response.json())
  .then(assets => {
    const grid = document.getElementById('asset-grid');

    assets.forEach(asset => {
      const card = document.createElement('div');
      card.className = 'asset-card';

      card.innerHTML = `
        <img class="asset-thumb" src="${asset.cover}" alt="${asset.title}">
        <h3>${asset.title}</h3>
        <p>${asset.shortDescription}</p>
      `;

      grid.appendChild(card);
    });
  })
  .catch(err => {
    console.error('Failed to load assets.json', err);
  });

const tg = window.Telegram.WebApp;
tg.expand();

let cart = [];

function renderCatalog() {
  const catalog = document.getElementById('catalog');
  catalog.innerHTML = '';
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'card';
    const inCart = cart.find(i => i.id === product.id);
    card.innerHTML = `
      <div class="placeholder-img">${product.emoji}</div>
      <div class="card-body">
        <div class="card-title">${product.title}</div>
        <div class="card-price">₽${product.price.toLocaleString()}</div>
        <div class="card-stars">⭐ ${product.stars} Stars</div>
        <button class="card-btn ${inCart ? 'in-cart' : ''}" onclick="toggleCart(${product.id})">
          ${inCart ? '✓ В корзине' : 'В корзину'}
        </button>
      </div>
    `;
    catalog.appendChild(card);
  });
}

function toggleCart(id) {
  const product = products.find(p => p.id === id);
  const index = cart.findIndex(i => i.id === id);
  if (index === -1) {
    cart.push(product);
  } else {
    cart.splice(index, 1);
  }
  updateCartBar();
  renderCatalog();
}

function updateCartBar() {
  const bar = document.getElementById('cart-bar');
  const info = document.getElementById('cart-info');
  if (cart.length === 0) {
    bar.classList.add('hidden');
  } else {
    bar.classList.remove('hidden');
    const total = cart.reduce((sum, i) => sum + i.price, 0);
    info.textContent = `${cart.length} шт. — ₽${total.toLocaleString()}`;
  }
}

document.getElementById('checkout-btn').addEventListener('click', () => {
  if (cart.length === 0) return;
  const order = cart.map(i => `${i.title} — ₽${i.price}`).join('\n');
  tg.sendData(JSON.stringify({
    action: 'order',
    items: cart.map(i => ({ id: i.id, title: i.title, price: i.price, stars: i.stars }))
  }));
});

renderCatalog();

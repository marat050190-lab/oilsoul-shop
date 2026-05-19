const tg = window.Telegram?.WebApp;
if (tg) tg.expand();

let cart = [];

function showPage(pageId) {
  document.getElementById('page-catalog').classList.add('hidden');
  document.getElementById('page-checkout').classList.add('hidden');
  document.getElementById(pageId).classList.remove('hidden');
}

function renderCatalog() {
  const catalog = document.getElementById('catalog');
  catalog.innerHTML = '';
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'card';
    const inCart = cart.find(i => i.id === product.id);
    card.innerHTML = `
      ${product.image 
        ? `<img src="${product.image}" alt="${product.title}">` 
        : `<div class="placeholder-img">${product.emoji}</div>`}
      <div class="card-body">
        <div class="card-title">${product.title}</div>
        <div class="card-price">₽${product.price.toLocaleString()} / ${product.ton} TON</div>
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
    const totalTon = cart.reduce((sum, i) => sum + i.ton, 0);
    info.textContent = `${cart.length} шт. — ${totalTon.toFixed(1)} TON`;
  }
}

function renderCheckout() {
  const totalTon = cart.reduce((sum, i) => sum + i.ton, 0);
  
  const summary = document.getElementById('order-summary');
  summary.innerHTML = `
    <h3>🛒 Ваш заказ</h3>
    ${cart.map(i => `
      <div class="order-item">
        <span>${i.emoji} ${i.title}</span>
        <span>${i.ton} TON</span>
      </div>
    `).join('')}
    <div class="order-total">
      <span>Итого:</span>
      <span>${totalTon.toFixed(1)} TON</span>
    </div>
  `;

  document.getElementById('ton-amount').textContent = totalTon.toFixed(1);
  document.getElementById('ton-address-display').textContent = TON_WALLET;
}

document.getElementById('checkout-btn').addEventListener('click', () => {
  if (cart.length === 0) return;
  renderCheckout();
  showPage('page-checkout');
  window.scrollTo(0, 0);
});

document.getElementById('back-btn').addEventListener('click', () => {
  showPage('page-catalog');
});

document.getElementById('submit-btn').addEventListener('click', async () => {
  const name = document.getElementById('field-name').value.trim();
  const country = document.getElementById('field-country').value.trim();
  const city = document.getElementById('field-city').value.trim();
  const address = document.getElementById('field-address').value.trim();
  const postal = document.getElementById('field-postal').value.trim();
  const phone = document.getElementById('field-phone').value.trim();
  const comment = document.getElementById('field-comment').value.trim();

  if (!name || !country || !city || !address || !postal || !phone) {
    alert('Пожалуйста заполните все обязательные поля');
    return;
  }

  const user = tg?.initDataUnsafe?.user;
  const totalTon = cart.reduce((sum, i) => sum + i.ton, 0);

  const orderData = {
    action: 'order',
    chat_id: user?.id,
    user_name: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : name,
    items: cart.map(i => ({ id: i.id, title: i.title, price: i.price, ton: i.ton })),
    total_ton: totalTon,
    delivery: { name, country, city, address, postal, phone, comment }
  };

  try {
    const res = await fetch('https://oilsoul-bot.onrender.com/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    const result = await res.json();
    if (result.ok) {
      alert(`✅ Заказ принят!\n\nПереведите ${totalTon.toFixed(1)} TON на адрес:\n${TON_WALLET}\n\nПосле оплаты пришлите скриншот боту @OilSoulBot`);
      cart = [];
      updateCartBar();
      showPage('page-catalog');
      renderCatalog();
    }
  } catch (e) {
    alert('Ошибка соединения. Попробуйте ещё раз.');
  }
});

renderCatalog();

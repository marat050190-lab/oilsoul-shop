const tg = window.Telegram?.WebApp;
if (tg) tg.expand();

let cart = [];

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
    const total = cart.reduce((sum, i) => sum + i.price, 0);
    const totalTon = cart.reduce((sum, i) => sum + i.ton, 0);
    info.textContent = `${cart.length} шт. — ${totalTon.toFixed(1)} TON`;
  }
}

document.getElementById('checkout-btn').addEventListener('click', async () => {
  if (cart.length === 0) return;

  const user = tg?.initDataUnsafe?.user;
  const chatId = user?.id;
  const totalTon = cart.reduce((sum, i) => sum + i.ton, 0);

  const orderData = {
    action: 'order',
    chat_id: chatId,
    user_name: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Неизвестен',
    items: cart.map(i => ({ id: i.id, title: i.title, price: i.price, ton: i.ton })),
    total_ton: totalTon
  };

  try {
    const res = await fetch('https://oilsoul-bot.onrender.com/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    const result = await res.json();
    if (result.ok) {
      // Показываем инструкцию по оплате
      const msg = `💎 Оплата TON\n\nПереведите ${totalTon.toFixed(1)} TON на адрес:\n\n${TON_WALLET}\n\nПосле оплаты отправьте скриншот боту @OilSoulBot`;
      alert(msg);
      cart = [];
      updateCartBar();
      renderCatalog();
    }
  } catch (e) {
    alert('Ошибка соединения. Попробуйте ещё раз.');
  }
});

renderCatalog();

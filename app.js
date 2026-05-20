const tg = window.Telegram?.WebApp;
if (tg) tg.expand();

let cart = [];

const descriptions = {
  2: `🏆 Golden Trophy #1
Original Oil Painting

Размер: 30×30 см
Материал: Масляная живопись на холсте
Основа: Галерейная натяжка
Статус: Оригинальная авторская работа

Golden Trophy #1 — художественный объект, вдохновлённый цифровой культурой и символикой победы. Работа объединяет эстетику современных digital-символов с живой фактурой классической масляной живописи.

Картина написана вручную с использованием многослойной техники:
— глубокий синий градиентный фон
— скрытый паттерн из еле заметных символов
— объёмные световые блики
— фактурная проработка золота

При разном освещении картина раскрывается по-разному: издалека выглядит как минималистичный символ, а вблизи открывает множество деталей и текстур.

Особенности:
- Полностью ручная работа
- Масляные краски профессионального уровня
- Фактурные мазки и живой рельеф
- Боковые стороны холста прокрашены

В комплекте:
— Картина
— Защитная упаковка
— Сертификат подлинности

Коллекция: Oil & Soul
Год: 2026`
};

function showPage(pageId) {
  document.getElementById('page-catalog').classList.add('hidden');
  document.getElementById('page-checkout').classList.add('hidden');
  document.getElementById('page-detail').classList.add('hidden');
  document.getElementById(pageId).classList.remove('hidden');
  window.scrollTo(0, 0);
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
        <div class="card-title">${product.emoji} ${product.title}</div>
        <div class="card-price">${product.ton} TON</div>
        <div class="card-actions">
          <button class="card-btn-detail" onclick="showDetail(${product.id})">Подробнее</button>
          <button class="card-btn ${inCart ? 'in-cart' : ''}" onclick="toggleCart(${product.id})">
            ${inCart ? '✓' : '+ Купить'}
          </button>
        </div>
      </div>
    `;
    catalog.appendChild(card);
  });
}

function showDetail(id) {
  const product = products.find(p => p.id === id);
  const inCart = cart.find(i => i.id === id);
  const desc = descriptions[id];

  const page = document.getElementById('page-detail');
  page.innerHTML = `
    <header>
      <button onclick="showPage('page-catalog')">← Назад</button>
      <h1>${product.title}</h1>
    </header>
    <div class="detail-content">
      ${product.image 
        ? `<img src="${product.image}" alt="${product.title}" class="detail-img">` 
        : `<div class="detail-placeholder">${product.emoji}</div>`}
      <div class="detail-price">${product.ton} TON</div>
      ${desc 
        ? `<div class="detail-desc">${desc.replace(/\n/g, '<br>')}</div>`
        : `<div class="detail-desc">${product.description}</div>`}
      <button class="submit-btn ${inCart ? 'in-cart-btn' : ''}" onclick="toggleCart(${product.id}); renderCatalog();">
        ${inCart ? '✓ В корзине' : '+ Добавить в корзину'}
      </button>
    </div>
  `;
  showPage('page-detail');
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
    info.textContent = `${cart.length} шт. — ${totalTon} TON`;
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
      <span>${totalTon} TON</span>
    </div>
  `;
  document.getElementById('ton-amount').textContent = totalTon;
  document.getElementById('ton-address-display').textContent = TON_WALLET;
}

document.getElementById('checkout-btn').addEventListener('click', () => {
  if (cart.length === 0) return;
  renderCheckout();
  showPage('page-checkout');
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
    items: cart.map(i => ({ id: i.id, title: i.title, ton: i.ton })),
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
      alert(`✅ Заказ принят!\n\nПереведите ${totalTon} TON на адрес:\n${TON_WALLET}\n\nПосле оплаты пришлите скриншот боту @OilSoulBot`);
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

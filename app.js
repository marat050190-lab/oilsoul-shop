const tg = window.Telegram?.WebApp;
if (tg) tg.expand();

let cart = [];
let tonPrice = null;
let lang = 'ru';

const i18n = {
  ru: {
    header_title: '🎨 Oil&Soul',
    header_sub: 'Картины маслом в стиле Telegram',
    btn_details: 'Подробнее',
    btn_buy: '+ Купить',
    btn_in_cart: '✓',
    btn_add_cart: '+ Добавить в корзину',
    btn_in_cart_full: '✓ В корзине',
    cart_btn: 'Оформить заказ →',
    checkout_title: 'Оформление заказа',
    back: '← Назад',
    back_catalog: '← В каталог',
    order_title: '🛒 Ваш заказ',
    order_total: 'Итого:',
    delivery_title: '📦 Данные для доставки',
    field_name: 'Имя и фамилия *',
    field_country: 'Страна *',
    field_city: 'Город *',
    field_address: 'Адрес (улица, дом, квартира) *',
    field_postal: 'Почтовый индекс *',
    field_phone: 'Телефон *',
    field_email: 'Email *',
    field_comment: 'Комментарий к заказу (необязательно)',
    payment_title: '💎 Оплата',
    payment_text: 'Переведите',
    payment_text2: 'TON на адрес:',
    payment_note: 'После оплаты нажмите кнопку ниже и пришлите скриншот транзакции боту',
    submit_btn: '✅ Подтвердить заказ',
    fill_fields: 'Пожалуйста заполните все обязательные поля',
    connection_error: 'Ошибка соединения. Попробуйте ещё раз.',
    payment_done: 'Заказ оформлен!',
    payment_sub: 'Осталось оплатить',
    pay_wallet: 'Оплатить через @wallet',
    pay_wallet_sub: 'Telegram кошелёк',
    pay_tonkeeper: 'Оплатить через Tonkeeper',
    pay_tonkeeper_sub: 'Мобильное приложение',
    other_wallet: 'Другой кошелёк — скопируйте адрес:',
    amount: 'Сумма:',
    copy: 'Копировать',
    payment_page_title: 'Оплата заказа',
    after_payment: 'После перевода напишите нам в',
    after_payment2: '— мы подтвердим получение и приступим к упаковке.',
  },
  en: {
    header_title: '🎨 Oil&Soul',
    header_sub: 'Oil paintings in Telegram style',
    btn_details: 'Details',
    btn_buy: '+ Buy',
    btn_in_cart: '✓',
    btn_add_cart: '+ Add to cart',
    btn_in_cart_full: '✓ In cart',
    cart_btn: 'Checkout →',
    checkout_title: 'Checkout',
    back: '← Back',
    back_catalog: '← To catalog',
    order_title: '🛒 Your order',
    order_total: 'Total:',
    delivery_title: '📦 Delivery details',
    field_name: 'Full name *',
    field_country: 'Country *',
    field_city: 'City *',
    field_address: 'Address (street, building, apt) *',
    field_postal: 'Postal code *',
    field_phone: 'Phone *',
    field_email: 'Email *',
    field_comment: 'Order comment (optional)',
    payment_title: '💎 Payment',
    payment_text: 'Send',
    payment_text2: 'TON to address:',
    payment_note: 'After payment tap the button below and send a screenshot to our bot',
    submit_btn: '✅ Confirm order',
    fill_fields: 'Please fill in all required fields',
    connection_error: 'Connection error. Please try again.',
    payment_done: 'Order placed!',
    payment_sub: 'Please pay',
    pay_wallet: 'Pay via @wallet',
    pay_wallet_sub: 'Telegram wallet',
    pay_tonkeeper: 'Pay via Tonkeeper',
    pay_tonkeeper_sub: 'Mobile app',
    other_wallet: 'Other wallet — copy the address:',
    amount: 'Amount:',
    copy: 'Copy',
    payment_page_title: 'Payment',
    after_payment: 'After sending, message us at',
    after_payment2: '— we will confirm receipt and start packing.',
  }
};

function t(key) {
  return i18n[lang][key] || key;
}

function setLang(l) {
  lang = l;
  document.getElementById('lang-ru').classList.toggle('lang-active', l === 'ru');
  document.getElementById('lang-en').classList.toggle('lang-active', l === 'en');
  document.querySelector('#page-catalog header h1').textContent = t('header_title');
  document.querySelector('#page-catalog header p').textContent = t('header_sub');
  document.getElementById('checkout-btn').textContent = t('cart_btn');
  document.getElementById('field-name').placeholder = t('field_name');
  document.getElementById('field-country').placeholder = t('field_country');
  document.getElementById('field-city').placeholder = t('field_city');
  document.getElementById('field-address').placeholder = t('field_address');
  document.getElementById('field-postal').placeholder = t('field_postal');
  document.getElementById('field-phone').placeholder = t('field_phone');
  document.getElementById('field-email').placeholder = t('field_email');
  document.getElementById('field-comment').placeholder = t('field_comment');
  document.getElementById('submit-btn').textContent = t('submit_btn');
  renderCatalog();
}

async function fetchTonPrice() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd,rub');
    const data = await res.json();
    tonPrice = data['the-open-network'];
    renderCatalog();
  } catch (e) {
    console.log('Price not loaded');
  }
}

function formatPrice(ton) {
  if (!tonPrice) return `${ton} TON`;
  const rub = Math.round(ton * tonPrice.rub);
  return lang === 'ru'
    ? `${ton} TON (~${rub.toLocaleString('ru-RU')} ₽)`
    : `${ton} TON (~${rub.toLocaleString('ru-RU')} ₽)`;
}

const descriptions = {
  ru: {
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
  },
  en: {
    2: `🏆 Golden Trophy #1
Original Oil Painting

Size: 30×30 cm
Medium: Oil on canvas
Support: Gallery-wrapped canvas
Status: Original artwork

Golden Trophy #1 is an art object inspired by digital culture and the symbolism of victory. The work unites the aesthetics of modern digital symbols with the living texture of classical oil painting.

Hand-painted using a multi-layer technique:
— deep blue gradient background
— hidden pattern of subtle symbols
— volumetric light reflections
— textured gold rendering

Under different lighting the painting reveals itself differently: from a distance it looks like a minimalist symbol, up close it opens up a world of detail and texture.

Features:
- Entirely hand-painted
- Professional-grade oil paints
- Textured brushwork and live relief
- Painted sides

Included:
— Painting
— Protective packaging
— Certificate of authenticity

Collection: Oil & Soul
Year: 2026`
  }
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
        <div class="card-price">${formatPrice(product.ton)}</div>
        <div class="card-actions">
          <button class="card-btn-detail" onclick="showDetail(${product.id})">${t('btn_details')}</button>
          <button class="card-btn ${inCart ? 'in-cart' : ''}" onclick="toggleCart(${product.id})">
            ${inCart ? t('btn_in_cart') : t('btn_buy')}
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
  const desc = descriptions[lang]?.[id] || descriptions['ru']?.[id];

  const page = document.getElementById('page-detail');
  page.innerHTML = `
    <header>
      <button onclick="showPage('page-catalog')">${t('back')}</button>
      <h1>${product.title}</h1>
    </header>
    <div class="detail-content">
      ${product.image
        ? `<img src="${product.image}" alt="${product.title}" class="detail-img">`
        : `<div class="detail-placeholder">${product.emoji}</div>`}
      <div class="detail-price">${formatPrice(product.ton)}</div>
      ${desc
        ? `<div class="detail-desc">${desc.replace(/\n/g, '<br>')}</div>`
        : `<div class="detail-desc">${product.description}</div>`}
      <button class="submit-btn ${inCart ? 'in-cart-btn' : ''}" onclick="toggleCart(${product.id}); renderCatalog(); this.className='submit-btn in-cart-btn'; this.textContent='${t('btn_in_cart_full')}';">
        ${inCart ? t('btn_in_cart_full') : t('btn_add_cart')}
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
    const totalRub = tonPrice ? Math.round(totalTon * tonPrice.rub).toLocaleString('ru-RU') + ' ₽' : '';
    info.textContent = `${cart.length} — ${totalTon} TON ${totalRub ? '(~' + totalRub + ')' : ''}`;
  }
}

function renderCheckout() {
  const totalTon = cart.reduce((sum, i) => sum + i.ton, 0);
  const summary = document.getElementById('order-summary');
  summary.innerHTML = `
    <h3>${t('order_title')}</h3>
    ${cart.map(i => `
      <div class="order-item">
        <span>${i.emoji} ${i.title}</span>
        <span>${i.ton} TON</span>
      </div>
    `).join('')}
    <div class="order-total">
      <span>${t('order_total')}</span>
      <span>${totalTon} TON${tonPrice ? ` (~${Math.round(totalTon * tonPrice.rub).toLocaleString('ru-RU')} ₽)` : ''}</span>
    </div>
  `;
  document.getElementById('ton-amount').textContent = totalTon;
  document.getElementById('ton-address-display').textContent = TON_WALLET;
  document.querySelector('#page-checkout header h1').textContent = t('checkout_title');
  document.getElementById('back-btn').textContent = t('back');
  document.querySelector('.form-section h3').textContent = t('delivery_title');
  document.getElementById('submit-btn').textContent = t('submit_btn');
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
  const email = document.getElementById('field-email').value.trim();
  const comment = document.getElementById('field-comment').value.trim();

  if (!name || !country || !city || !address || !postal || !phone || !email) {
    alert(t('fill_fields'));
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
    delivery: { name, country, city, address, postal, phone, email, comment }
  };

  try {
    const res = await fetch('https://oilsoul-bot.onrender.com/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    const result = await res.json();
    if (result.ok) {
      showPayment(totalTon);
    }
  } catch (e) {
    alert(t('connection_error'));
  }
});

function showPayment(totalTon) {
  cart = [];
  updateCartBar();

  const walletLink = `ton://transfer/${TON_WALLET}?amount=${Math.round(totalTon * 1e9)}&text=OilSoul`;
  const tonkeeperLink = `https://app.tonkeeper.com/transfer/${TON_WALLET}?amount=${Math.round(totalTon * 1e9)}&text=OilSoul`;

  const page = document.getElementById('page-detail');
  page.innerHTML = `
    <header>
      <button onclick="showPage('page-catalog')">${t('back_catalog')}</button>
      <h1>${t('payment_page_title')}</h1>
    </header>
    <div class="detail-content">
      <div class="payment-success-icon">💎</div>
      <div class="payment-success-title">${t('payment_done')}</div>
      <div class="payment-success-sub">${t('payment_sub')} ${totalTon} TON</div>
      <div class="payment-buttons">
        <a href="${walletLink}" class="pay-btn pay-btn-wallet">
          <span class="pay-btn-icon">✈️</span>
          <span class="pay-btn-text">
            <strong>${t('pay_wallet')}</strong>
            <small>${t('pay_wallet_sub')}</small>
          </span>
        </a>
        <a href="${tonkeeperLink}" class="pay-btn pay-btn-tonkeeper">
          <span class="pay-btn-icon">💎</span>
          <span class="pay-btn-text">
            <strong>${t('pay_tonkeeper')}</strong>
            <small>${t('pay_tonkeeper_sub')}</small>
          </span>
        </a>
      </div>
      <div class="payment-manual">
        <div class="payment-manual-label">${t('other_wallet')}</div>
        <div class="payment-address-row">
          <div class="payment-address">${TON_WALLET}</div>
          <button class="copy-btn" onclick="
            navigator.clipboard.writeText('${TON_WALLET}');
            this.textContent='✓';
            this.style.background='#27ae60';
            setTimeout(()=>{this.textContent='${t('copy')}';this.style.background='';},2000)
          ">${t('copy')}</button>
        </div>
        <div class="payment-amount-row">
          <span>${t('amount')}</span>
          <strong>${totalTon} TON</strong>
          <button class="copy-btn" onclick="
            navigator.clipboard.writeText('${totalTon}');
            this.textContent='✓';
            this.style.background='#27ae60';
            setTimeout(()=>{this.textContent='${t('copy')}';this.style.background='';},2000)
          ">${t('copy')}</button>
        </div>
      </div>
      <div class="payment-note-box">
        <div class="payment-note-icon">ℹ️</div>
        <div>${t('after_payment')} <a href="https://t.me/OilSoulBot" style="color:#f0c040">@OilSoulBot</a> ${t('after_payment2')}</div>
      </div>
    </div>
  `;
  showPage('page-detail');
}

fetchTonPrice();
renderCatalog();

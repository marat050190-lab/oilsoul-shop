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
    custom_page_title: 'Картина с вашего подарка',
    custom_heading: '🎁 Ваш подарок — на холсте',
    custom_text: 'Есть редкий или любимый подарок Telegram? Plush Pepe, Homemade Cake, Cyberpunk Skull — напишем его маслом на холсте. Уникальный физический аналог вашего цифрового подарка.',
    custom_timeline: '⏱ Срок написания картины: 21 день + доставка',
    custom_how_title: 'КАК ЭТО РАБОТАЕТ:',
    custom_step1: '1. Заполните форму ниже',
    custom_step2: '2. Пришлите ссылку на ваш подарок Telegram',
    custom_step3: '3. Мы подтвердим заказ и пришлём реквизиты',
    custom_step4: '4. После оплаты приступаем к работе',
    custom_gift_label: '🔗 Ссылка на ваш подарок',
    custom_gift_placeholder: 'https://t.me/nft/...',
    custom_gift_hint: 'Как получить: профиль → Мои подарки → нажмите на подарок → Поделиться → скопируйте ссылку',
    custom_delivery_label: '📦 Данные для доставки',
    custom_conditions_label: '💎 Условия заказа',
    custom_size: 'Размер',
    custom_price: 'Стоимость',
    custom_deadline: 'Срок',
    custom_nft: 'Уникальный NFT-номер на картине',
    custom_submit: '✅ Отправить заказ',
    custom_fill_fields: 'Пожалуйста заполните все поля, включая ссылку на подарок',
    custom_success: 'Заказ отправлен! Бот пришлёт реквизиты для оплаты.',
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
    custom_page_title: 'Paint your gift',
    custom_heading: '🎁 Your gift — on canvas',
    custom_text: 'Have a rare or favourite Telegram gift? Plush Pepe, Homemade Cake, Cyberpunk Skull — we\'ll paint it in oil on canvas. A unique physical version of your digital collectible.',
    custom_timeline: '⏱ Painting time: 21 days + shipping',
    custom_how_title: 'HOW IT WORKS:',
    custom_step1: '1. Fill in the form below',
    custom_step2: '2. Send a link to your Telegram gift',
    custom_step3: '3. We confirm and send payment details',
    custom_step4: '4. After payment we start painting',
    custom_gift_label: '🔗 Link to your gift',
    custom_gift_placeholder: 'https://t.me/nft/...',
    custom_gift_hint: 'How to get it: profile → My Gifts → tap the gift → Share → copy the link',
    custom_delivery_label: '📦 Delivery details',
    custom_conditions_label: '💎 Order terms',
    custom_size: 'Size',
    custom_price: 'Price',
    custom_deadline: 'Timeline',
    custom_nft: 'Unique NFT number on the painting',
    custom_submit: '✅ Send order',
    custom_fill_fields: 'Please fill in all fields including the gift link',
    custom_success: 'Order sent! The bot will send payment details.',
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
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd');
    const data = await res.json();
    tonPrice = data['the-open-network'];
    renderCatalog();
  } catch (e) {
    console.log('Price not loaded');
  }
}

function formatPrice(ton) {
  if (!tonPrice) return ton + ' TON';
  const usd = (ton * tonPrice.usd).toFixed(0);
  return ton + ' TON (~$' + Number(usd).toLocaleString('en-US') + ')';
}

const descriptions = {
  ru: {
    2: '🏆 Golden Trophy #1\nOriginal Oil Painting\n\nРазмер: 30×30 см\nМатериал: Масляная живопись на холсте\nОснова: Галерейная натяжка\nСтатус: Оригинальная авторская работа\n\nGolden Trophy #1 — художественный объект, вдохновлённый цифровой культурой и символикой победы.\n\nКартина написана вручную с использованием многослойной техники:\n— глубокий синий градиентный фон\n— скрытый паттерн из еле заметных символов\n— объёмные световые блики\n— фактурная проработка золота\n\nОсобенности:\n- Полностью ручная работа\n- Масляные краски профессионального уровня\n- Фактурные мазки и живой рельеф\n- Боковые стороны холста прокрашены\n\nВ комплекте:\n— Картина\n— Защитная упаковка\n— Сертификат подлинности\n\nКоллекция: Oil & Soul\nГод: 2026'
  },
  en: {
    2: '🏆 Golden Trophy #1\nOriginal Oil Painting\n\nSize: 30×30 cm\nMedium: Oil on canvas\nSupport: Gallery-wrapped canvas\nStatus: Original artwork\n\nHand-painted using a multi-layer technique:\n— deep blue gradient background\n— hidden pattern of subtle symbols\n— volumetric light reflections\n— textured gold rendering\n\nFeatures:\n- Entirely hand-painted\n- Professional-grade oil paints\n- Textured brushwork and live relief\n- Painted sides\n\nIncluded:\n— Painting\n— Protective packaging\n— Certificate of authenticity\n\nCollection: Oil & Soul\nYear: 2026'
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
  products.forEach(function(product) {
    const card = document.createElement('div');
    card.className = 'card';
    const inCart = cart.find(function(i) { return i.id === product.id; });
    card.innerHTML =
      (product.image
        ? '<img src="' + product.image + '" alt="' + product.title + '">'
        : '<div class="placeholder-img">' + product.emoji + '</div>') +
      '<div class="card-body">' +
        '<div class="card-title">' + product.emoji + ' ' + product.title + '</div>' +
        '<div class="card-price">' + formatPrice(product.ton) + '</div>' +
        '<div class="card-actions">' +
          '<button class="card-btn-detail" onclick="showDetail(' + product.id + ')">' + t('btn_details') + '</button>' +
          '<button class="card-btn ' + (inCart ? 'in-cart' : '') + '" onclick="toggleCart(' + product.id + ')">' +
            (inCart ? t('btn_in_cart') : t('btn_buy')) +
          '</button>' +
        '</div>' +
      '</div>';
    catalog.appendChild(card);
  });
}

function showDetail(id) {
  const product = products.find(function(p) { return p.id === id; });
  const inCart = cart.find(function(i) { return i.id === id; });
  const desc = (descriptions[lang] && descriptions[lang][id]) || (descriptions['ru'] && descriptions['ru'][id]);

  const page = document.getElementById('page-detail');
  page.innerHTML =
    '<header>' +
      '<button onclick="showPage(\'page-catalog\')">' + t('back') + '</button>' +
      '<h1>' + product.title + '</h1>' +
    '</header>' +
    '<div class="detail-content">' +
      (product.image
        ? '<img src="' + product.image + '" alt="' + product.title + '" class="detail-img">'
        : '<div class="detail-placeholder">' + product.emoji + '</div>') +
      '<div class="detail-price">' + formatPrice(product.ton) + '</div>' +
      (desc
        ? '<div class="detail-desc">' + desc.replace(/\n/g, '<br>') + '</div>'
        : '<div class="detail-desc">' + product.description + '</div>') +
      '<button id="detail-cart-btn" class="submit-btn ' + (inCart ? 'in-cart-btn' : '') + '" onclick="detailToggleCart(' + id + ')">' +
        (inCart ? t('btn_in_cart_full') : t('btn_add_cart')) +
      '</button>' +
    '</div>';
  showPage('page-detail');
}

function detailToggleCart(id) {
  toggleCart(id);
  const btn = document.getElementById('detail-cart-btn');
  if (!btn) return;
  const inCart = cart.find(function(i) { return i.id === id; });
  btn.className = 'submit-btn ' + (inCart ? 'in-cart-btn' : '');
  btn.textContent = inCart ? t('btn_in_cart_full') : t('btn_add_cart');
}

function toggleCart(id) {
  const product = products.find(function(p) { return p.id === id; });
  const index = cart.findIndex(function(i) { return i.id === id; });
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
    const totalTon = cart.reduce(function(sum, i) { return sum + i.ton; }, 0);
    const totalUsd = tonPrice ? '$' + (totalTon * tonPrice.usd).toFixed(0) : '';
    info.textContent = cart.length + ' — ' + totalTon + ' TON ' + (totalUsd ? '(~' + totalUsd + ')' : '');
  }
}

function renderCheckout() {
  const totalTon = cart.reduce(function(sum, i) { return sum + i.ton; }, 0);
  const summary = document.getElementById('order-summary');
  summary.innerHTML =
    '<h3>' + t('order_title') + '</h3>' +
    cart.map(function(i) {
      return '<div class="order-item"><span>' + i.emoji + ' ' + i.title + '</span><span>' + i.ton + ' TON</span></div>';
    }).join('') +
    '<div class="order-total">' +
      '<span>' + t('order_total') + '</span>' +
      '<span>' + totalTon + ' TON' + (tonPrice ? ' (~$' + (totalTon * tonPrice.usd).toFixed(0) + ')' : '') + '</span>' +
    '</div>';
  document.getElementById('ton-amount').textContent = totalTon;
  document.getElementById('ton-address-display').textContent = TON_WALLET;
  document.querySelector('#page-checkout header h1').textContent = t('checkout_title');
  document.getElementById('back-btn').textContent = t('back');
  document.querySelector('.form-section h3').textContent = t('delivery_title');
  document.getElementById('submit-btn').textContent = t('submit_btn');
}

function showCustomPage() {
  const page = document.getElementById('page-detail');
  page.innerHTML =
    '<header>' +
      '<button onclick="showPage(\'page-catalog\')">' + t('back') + '</button>' +
      '<h1>' + t('custom_page_title') + '</h1>' +
    '</header>' +
    '<div class="detail-content">' +
      '<img src="Durov\'s%20cap.png" alt="Пример работы" class="detail-img">' +
      '<div class="custom-example-label">Пример работы — Кепка Дурова</div>' +
      '<div class="custom-heading">' + t('custom_heading') + '</div>' +
      '<div class="custom-text">' + t('custom_text') + '</div>' +
      '<div class="custom-timeline">' + t('custom_timeline') + '</div>' +
      '<div class="custom-steps">' +
        '<div class="custom-steps-title">' + t('custom_how_title') + '</div>' +
        '<div class="custom-step">' + t('custom_step1') + '</div>' +
        '<div class="custom-step">' + t('custom_step2') + '</div>' +
        '<div class="custom-step">' + t('custom_step3') + '</div>' +
        '<div class="custom-step">' + t('custom_step4') + '</div>' +
      '</div>' +
      '<div class="custom-form">' +
        '<div class="custom-section">' +
          '<div class="custom-section-title">' + t('custom_gift_label') + '</div>' +
          '<input type="url" id="custom-gift-link" class="custom-input" placeholder="' + t('custom_gift_placeholder') + '">' +
          '<div class="custom-hint">' + t('custom_gift_hint') + '</div>' +
        '</div>' +
        '<div class="custom-section">' +
          '<div class="custom-section-title">' + t('custom_delivery_label') + '</div>' +
          '<input type="text" id="custom-name" class="custom-input" placeholder="' + t('field_name') + '">' +
          '<div class="autocomplete-wrap">' +
            '<input type="text" id="custom-country" class="custom-input" placeholder="' + t('field_country') + '">' +
          '</div>' +
          '<div class="autocomplete-wrap">' +
            '<input type="text" id="custom-city" class="custom-input" placeholder="' + t('field_city') + '">' +
          '</div>' +
          '<div class="autocomplete-wrap">' +
            '<input type="text" id="custom-address" class="custom-input" placeholder="' + t('field_address') + '">' +
          '</div>' +
          '<input type="text" id="custom-postal" class="custom-input" placeholder="' + t('field_postal') + '">' +
          '<input type="tel" id="custom-phone" class="custom-input" placeholder="' + t('field_phone') + '">' +
          '<input type="email" id="custom-email" class="custom-input" placeholder="' + t('field_email') + '">' +
          '<textarea id="custom-comment" class="custom-input custom-textarea" placeholder="' + t('field_comment') + '"></textarea>' +
        '</div>' +
        '<div class="custom-section custom-conditions">' +
          '<div class="custom-section-title">' + t('custom_conditions_label') + '</div>' +
          '<div class="custom-condition-row"><span>' + t('custom_size') + '</span><span>30×30 см</span></div>' +
          '<div class="custom-condition-row"><span>' + t('custom_price') + '</span><span class="custom-condition-value">149 TON' + (tonPrice ? ' (~$' + (149 * tonPrice.usd).toFixed(0) + ')' : '') + '</span></div>' +
          '<div class="custom-condition-row"><span>' + t('custom_deadline') + '</span><span>21 день + доставка</span></div>' +
          '<div class="custom-condition-row"><span>' + t('custom_nft') + '</span><span>✓</span></div>' +
        '</div>' +
        '<button class="submit-btn" onclick="submitCustomOrder()">' + t('custom_submit') + '</button>' +
      '</div>' +
    '</div>';
  showPage('page-detail');
  setTimeout(initCustomAutocomplete, 100);
}

async function submitCustomOrder() {
  const giftLink = document.getElementById('custom-gift-link').value.trim();
  const name = document.getElementById('custom-name').value.trim();
  const country = document.getElementById('custom-country').value.trim();
  const city = document.getElementById('custom-city').value.trim();
  const address = document.getElementById('custom-address').value.trim();
  const postal = document.getElementById('custom-postal').value.trim();
  const phone = document.getElementById('custom-phone').value.trim();
  const email = document.getElementById('custom-email').value.trim();
  const comment = document.getElementById('custom-comment').value.trim();

  if (!giftLink || !name || !country || !city || !address || !postal || !phone || !email) {
    alert(t('custom_fill_fields'));
    return;
  }

  const user = tg && tg.initDataUnsafe && tg.initDataUnsafe.user;

  const orderData = {
    action: 'custom_order',
    chat_id: user ? user.id : null,
    user_name: user ? ((user.first_name || '') + ' ' + (user.last_name || '')).trim() : name,
    gift_link: giftLink,
    delivery: { name: name, country: country, city: city, address: address, postal: postal, phone: phone, email: email, comment: comment }
  };

  try {
    const res = await fetch('https://oilsoul-bot.onrender.com/custom_order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    const result = await res.json();
    if (result.ok) {
      const page = document.getElementById('page-detail');
      page.innerHTML =
        '<header>' +
          '<button onclick="showPage(\'page-catalog\')">' + t('back_catalog') + '</button>' +
          '<h1>' + t('custom_page_title') + '</h1>' +
        '</header>' +
        '<div class="detail-content">' +
          '<div class="payment-success-icon">🎨</div>' +
          '<div class="payment-success-title">' + t('custom_success') + '</div>' +
          '<div class="payment-success-sub">Проверьте чат с @OilSoulBot — там будут реквизиты для оплаты.</div>' +
        '</div>';
      showPage('page-detail');
    }
  } catch (e) {
    alert(t('connection_error'));
  }
}

document.getElementById('checkout-btn').addEventListener('click', function() {
  if (cart.length === 0) return;
  renderCheckout();
  showPage('page-checkout');
});

document.getElementById('back-btn').addEventListener('click', function() {
  showPage('page-catalog');
});

document.getElementById('submit-btn').addEventListener('click', async function() {
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

  const user = tg && tg.initDataUnsafe && tg.initDataUnsafe.user;
  const totalTon = cart.reduce(function(sum, i) { return sum + i.ton; }, 0);

  const orderData = {
    action: 'order',
    chat_id: user ? user.id : null,
    user_name: user ? ((user.first_name || '') + ' ' + (user.last_name || '')).trim() : name,
    items: cart.map(function(i) { return { id: i.id, title: i.title, ton: i.ton }; }),
    total_ton: totalTon,
    delivery: { name: name, country: country, city: city, address: address, postal: postal, phone: phone, email: email, comment: comment }
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

function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(function() {
    const original = btn.textContent;
    btn.textContent = '✓';
    btn.style.background = '#27ae60';
    setTimeout(function() {
      btn.textContent = original;
      btn.style.background = '';
    }, 2000);
  });
}

function showPayment(totalTon) {
  cart = [];
  updateCartBar();

  const walletLink = 'ton://transfer/' + TON_WALLET + '?amount=' + Math.round(totalTon * 1e9) + '&text=OilSoul';
  const tonkeeperLink = 'https://app.tonkeeper.com/transfer/' + TON_WALLET + '?amount=' + Math.round(totalTon * 1e9) + '&text=OilSoul';
  const amountDisplay = totalTon + ' TON' + (tonPrice ? ' (~$' + (totalTon * tonPrice.usd).toFixed(0) + ')' : '');

  const page = document.getElementById('page-detail');
  page.innerHTML =
    '<header>' +
      '<button onclick="showPage(\'page-catalog\')">' + t('back_catalog') + '</button>' +
      '<h1>' + t('payment_page_title') + '</h1>' +
    '</header>' +
    '<div class="detail-content">' +
      '<div class="payment-success-icon">💎</div>' +
      '<div class="payment-success-title">' + t('payment_done') + '</div>' +
      '<div class="payment-success-sub">' + t('payment_sub') + ' ' + amountDisplay + '</div>' +
      '<div class="payment-buttons">' +
        '<a href="' + walletLink + '" class="pay-btn pay-btn-wallet">' +
          '<span class="pay-btn-icon">✈️</span>' +
          '<span class="pay-btn-text">' +
            '<strong>' + t('pay_wallet') + '</strong>' +
            '<small>' + t('pay_wallet_sub') + '</small>' +
          '</span>' +
        '</a>' +
        '<a href="' + tonkeeperLink + '" class="pay-btn pay-btn-tonkeeper">' +
          '<span class="pay-btn-icon">💎</span>' +
          '<span class="pay-btn-text">' +
            '<strong>' + t('pay_tonkeeper') + '</strong>' +
            '<small>' + t('pay_tonkeeper_sub') + '</small>' +
          '</span>' +
        '</a>' +
      '</div>' +
      '<div class="payment-manual">' +
        '<div class="payment-manual-label">' + t('other_wallet') + '</div>' +
        '<div class="payment-address-row">' +
          '<div class="payment-address">' + TON_WALLET + '</div>' +
          '<button class="copy-btn" onclick="copyToClipboard(\'' + TON_WALLET + '\', this)">' + t('copy') + '</button>' +
        '</div>' +
        '<div class="payment-amount-row">' +
          '<span>' + t('amount') + '</span>' +
          '<strong>' + totalTon + ' TON</strong>' +
          '<button class="copy-btn" onclick="copyToClipboard(\'' + totalTon + '\', this)">' + t('copy') + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="payment-after">' +
        t('after_payment') + ' <a href="https://t.me/OilSoulBot" target="_blank">@OilSoulBot</a> ' + t('after_payment2') +
      '</div>' +
    '</div>';

  showPage('page-detail');
}

fetchTonPrice();
renderCatalog();

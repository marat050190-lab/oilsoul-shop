const tg = window.Telegram?.WebApp;
if (tg) tg.expand();

let cart = [];
let tonPrice = null;
let lang = 'ru';
let currentFilter = 'all';

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
    filter_all: 'Все',
    filter_ready: 'Ready to ship',
    filter_custom: 'Custom order',
    filter_sold: 'Sold',
    sold_label: 'Продано',
    custom_card_title: '🎁 Картина с вашего подарка',
    custom_card_desc: 'Закажите картину маслом по мотивам вашего коллекционного подарка Telegram',
    custom_card_btn: 'Заказать →',
    faq_title: 'FAQ',
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
    filter_all: 'All',
    filter_ready: 'Ready to ship',
    filter_custom: 'Custom order',
    filter_sold: 'Sold',
    sold_label: 'Sold',
    custom_card_title: '🎁 Paint your gift',
    custom_card_desc: 'Order an oil painting based on your Telegram collectible gift',
    custom_card_btn: 'Order →',
    faq_title: 'FAQ',
  }
};

function t(key) {
  return i18n[lang][key] || key;
}

function setLang(l) {
  lang = l;
  document.getElementById('lang-ru').classList.toggle('lang-active', l === 'ru');
  document.getElementById('lang-en').classList.toggle('lang-active', l === 'en');
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

const faqItems = {
  ru: [
    { q: 'Что такое Oil&Soul?', a: 'Oil&Soul — сервис, где цифровые Telegram-подарки превращаются в физические картины маслом на холсте. Мы создаём готовые работы и картины под заказ по ссылке на ваш Telegram collectible gift. Каждая работа сопровождается сертификатом уникальности.' },
    { q: 'Это настоящая картина или распечатка?', a: 'Это настоящая картина, написанная вручную масляными красками на холсте. Не печать, не постер и не цифровая распечатка. Каждая работа имеет живую фактуру мазков и сопровождается сертификатом уникальности.' },
    { q: 'Какой размер картины?', a: 'Базовый формат — 30×30 см. Картина пишется на холсте на подрамнике. Боковые стороны прокрашиваются, поэтому работу можно размещать без рамы.' },
    { q: 'Можно ли заказать картину по моему Telegram-подарку?', a: 'Да. Вы отправляете ссылку на ваш Telegram-подарок, а мы создаём физическую картину маслом по его мотивам. На холсте можно указать NFT-номер вашего подарка.' },
    { q: 'Будет ли картина точной копией подарка?', a: 'Картина создаётся вручную, поэтому она не является пиксельной копией 1 в 1. Мы сохраняем основные элементы подарка: форму, цвета, фон, настроение и NFT-номер, но итоговая работа остаётся живой масляной интерпретацией с фактурой мазков.' },
    { q: 'Что нужно отправить для кастомного заказа?', a: 'Нужно отправить ссылку на ваш Telegram-подарок. Формат: https://t.me/nft/... Также можно добавить комментарий, если есть пожелания по NFT-номеру, фону или деталям.' },
    { q: 'Сколько времени занимает написание картины?', a: 'Стандартный срок написания картины — 21 день. После завершения работы картина проходит финальную проверку, затем упаковывается и отправляется вам.' },
    { q: 'Как происходит заказ картины с моего подарка?', a: '1. Вы отправляете ссылку на Telegram-подарок\n2. Мы проверяем подарок и согласуем детали\n3. После оплаты художник начинает работу\n4. Картина проходит финальную проверку\n5. Мы оформляем сертификат уникальности\n6. Картина упаковывается и отправляется вам' },
    { q: 'Какие материалы используются?', a: 'Холст на подрамнике, масляные краски, художественные кисти и мастихины, защитный лак после высыхания, упаковка для безопасной доставки.' },
    { q: 'Доставляете ли вы по всему миру?', a: 'Да, мы отправляем картины по всему миру. Стоимость и срок доставки зависят от страны получателя и рассчитываются индивидуально после оформления заказа.' },
    { q: 'Как упаковывается картина?', a: 'Картина упаковывается в защитную упаковку. Мы используем плотную упаковку, защитные слои и коробку, подходящую под формат холста.' },
    { q: 'Как происходит оплата?', a: 'Оплата принимается в TON. После оформления заказа вы получите данные для оплаты. После подтверждения оплаты заказ передаётся в работу.' },
    { q: 'Можно ли вернуть картину?', a: 'Готовые работы обсуждаются индивидуально. Кастомные картины создаются специально под ваш Telegram-подарок, поэтому возврат таких работ обычно невозможен после начала написания. Если возникнет проблема — рассмотрим ситуацию отдельно.' },
    { q: 'Что входит в заказ?', a: 'Картина маслом на холсте, прокрашенные боковые стороны, NFT-номер подарка на холсте (если предусмотрен), сертификат уникальности, защитная упаковка.' },
    { q: 'Что такое сертификат уникальности?', a: 'Сертификат подтверждает данные физической картины: название работы, NFT-номер подарка, техника (масло на холсте), размер, год создания и данные проекта Oil&Soul.' },
    { q: 'Будет ли QR-код на оригинальный Telegram-подарок?', a: 'Да, для кастомных работ можно добавить QR-код на обратную сторону картины. QR-код будет вести на ссылку оригинального Telegram-подарка. Наносится в виде аккуратной печатной наклейки.' },
  ],
  en: [
    { q: 'What is Oil&Soul?', a: 'Oil&Soul is a service that turns digital Telegram gifts into physical oil paintings on canvas. We create ready-made works and custom paintings based on your Telegram collectible gift link. Each work comes with a certificate of uniqueness.' },
    { q: 'Is it a real painting or a print?', a: 'It is a real painting, hand-painted with oil paints on canvas. Not a print, not a poster, not a digital reproduction. Each work has the live texture of brushstrokes and comes with a certificate of uniqueness.' },
    { q: 'What size is the painting?', a: 'The base format is 30×30 cm. The painting is made on a stretched canvas. The sides are painted, so the work can be displayed without a frame.' },
    { q: 'Can I order a painting based on my Telegram gift?', a: 'Yes. You send a link to your Telegram gift and we create a physical oil painting inspired by it. The NFT number of your gift can be included on the canvas.' },
    { q: 'Will the painting be an exact copy of the gift?', a: 'The painting is handmade, so it is not a pixel-perfect 1:1 copy. We preserve the key elements: shape, colors, background, mood and NFT number — but the final work remains a live oil interpretation with brushstroke texture.' },
    { q: 'What do I need to send for a custom order?', a: 'Send a link to your Telegram gift. Format: https://t.me/nft/... You can also add a comment if you have wishes regarding the NFT number, background or details.' },
    { q: 'How long does painting take?', a: 'The standard painting time is 21 days. After completion, the painting goes through a final check, then gets packaged and shipped to you.' },
    { q: 'How does a custom order work?', a: '1. You send a link to your Telegram gift\n2. We check the gift and agree on details\n3. After payment the artist starts work\n4. The painting passes a final check\n5. We prepare the certificate of uniqueness\n6. The painting is packaged and shipped to you' },
    { q: 'What materials are used?', a: 'Stretched canvas, oil paints, artist brushes and palette knives, protective varnish after drying, packaging for safe delivery.' },
    { q: 'Do you ship worldwide?', a: 'Yes, we ship paintings worldwide. The cost and time of delivery depend on the recipient\'s country and are calculated individually after placing an order.' },
    { q: 'How is the painting packaged?', a: 'The painting is packed in protective packaging. We use dense packing, protective layers and a box suitable for the canvas format.' },
    { q: 'How does payment work?', a: 'Payment is accepted in TON. After placing an order you will receive payment details. After payment confirmation the order goes into production.' },
    { q: 'Can I return a painting?', a: 'Ready-made works are discussed individually. Custom paintings are created specifically for your Telegram gift, so returns are usually not possible after painting has started. If a problem arises we will consider the situation separately.' },
    { q: 'What is included in the order?', a: 'Oil painting on canvas, painted sides, NFT number on canvas (if applicable), certificate of uniqueness, protective packaging.' },
    { q: 'What is the certificate of uniqueness?', a: 'The certificate confirms the physical painting data: title, NFT number, technique (oil on canvas), size, year of creation and Oil&Soul project details.' },
    { q: 'Will there be a QR code for the original Telegram gift?', a: 'Yes, for custom works a QR code can be added to the back of the painting. It will link to the original Telegram gift. Applied as a neat printed sticker.' },
  ]
};

function showPage(pageId) {
  document.getElementById('page-catalog').classList.add('hidden');
  document.getElementById('page-checkout').classList.add('hidden');
  document.getElementById('page-detail').classList.add('hidden');
  document.getElementById(pageId).classList.remove('hidden');
  window.scrollTo(0, 0);
}

function showFaqPage() {
  const items = faqItems[lang] || faqItems['ru'];
  const page = document.getElementById('page-detail');
  page.innerHTML =
    '<header>' +
      '<button onclick="showPage(\'page-catalog\')">' + t('back') + '</button>' +
      '<h1>' + t('faq_title') + '</h1>' +
    '</header>' +
    '<div class="detail-content">' +
      '<div class="faq-list">' +
        items.map(function(item, i) {
          return '<div class="faq-item" id="faq-' + i + '">' +
            '<div class="faq-question" onclick="toggleFaq(' + i + ')">' +
              '<span>' + item.q + '</span>' +
              '<span class="faq-arrow" id="faq-arrow-' + i + '">▾</span>' +
            '</div>' +
            '<div class="faq-answer" id="faq-answer-' + i + '">' +
              item.a.replace(/\n/g, '<br>') +
            '</div>' +
          '</div>';
        }).join('') +
      '</div>' +
      '<div class="custom-disclaimer" style="margin-top:16px">' +
        'Oil&Soul создаёт независимые картины маслом по мотивам коллекционных подарков Telegram. Проект не является официальным сервисом Telegram. Каждая работа — физическая художественная интерпретация цифрового подарка.' +
      '</div>' +
    '</div>';
  showPage('page-detail');
}

function toggleFaq(i) {
  var answer = document.getElementById('faq-answer-' + i);
  var arrow = document.getElementById('faq-arrow-' + i);
  var isOpen = answer.classList.contains('faq-open');
  document.querySelectorAll('.faq-answer').forEach(function(el) { el.classList.remove('faq-open'); });
  document.querySelectorAll('.faq-arrow').forEach(function(el) { el.textContent = '▾'; });
  if (!isOpen) {
    answer.classList.add('faq-open');
    arrow.textContent = '▴';
  }
}

function setFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(function(btn) {
    btn.classList.remove('filter-active');
  });
  document.getElementById('filter-' + filter).classList.add('filter-active');
  renderCatalog();
}

function renderCatalog() {
  const catalog = document.getElementById('catalog');
  catalog.innerHTML = '';

  const filterBar = document.createElement('div');
  filterBar.className = 'filter-bar';
  filterBar.innerHTML =
    '<button id="filter-all" class="filter-btn' + (currentFilter === 'all' ? ' filter-active' : '') + '" onclick="setFilter(\'all\')">' + t('filter_all') + '</button>' +
    '<button id="filter-ready" class="filter-btn' + (currentFilter === 'ready' ? ' filter-active' : '') + '" onclick="setFilter(\'ready\')">' + t('filter_ready') + '</button>' +
    '<button id="filter-custom" class="filter-btn' + (currentFilter === 'custom' ? ' filter-active' : '') + '" onclick="setFilter(\'custom\')">' + t('filter_custom') + '</button>' +
    '<button id="filter-sold" class="filter-btn' + (currentFilter === 'sold' ? ' filter-active' : '') + '" onclick="setFilter(\'sold\')">' + t('filter_sold') + '</button>';
  catalog.appendChild(filterBar);

  if (currentFilter === 'all' || currentFilter === 'custom') {
    const customCard = document.createElement('div');
    customCard.className = 'custom-order-card';
    customCard.innerHTML =
      '<div class="custom-order-card-img">' +
        '<img src="Durov\'s%20cap.png" alt="Custom order">' +
      '</div>' +
      '<div class="custom-order-card-body">' +
        '<div class="custom-order-card-title">' + t('custom_card_title') + '</div>' +
        '<div class="custom-order-card-desc">' + t('custom_card_desc') + '</div>' +
        '<div class="custom-order-card-price">149 TON' + (tonPrice ? ' (~$' + (149 * tonPrice.usd).toFixed(0) + ')' : '') + '</div>' +
        '<button class="custom-order-card-btn" onclick="showCustomPage()">' + t('custom_card_btn') + '</button>' +
      '</div>';
    catalog.appendChild(customCard);
  }

  const grid = document.createElement('div');
  grid.className = 'catalog-grid';

  const filtered = products.filter(function(p) {
    if (currentFilter === 'all') return p.status !== 'custom';
    return p.status === currentFilter;
  });

  if (filtered.length === 0 && currentFilter !== 'custom') {
    const empty = document.createElement('div');
    empty.className = 'catalog-empty';
    empty.textContent = currentFilter === 'sold' ? 'Проданные работы появятся здесь' : 'Нет работ в этой категории';
    grid.appendChild(empty);
  }

  filtered.forEach(function(product) {
    const card = document.createElement('div');
    card.className = 'card' + (product.status === 'sold' ? ' card-sold' : '');
    const inCart = cart.find(function(i) { return i.id === product.id; });
    const isSold = product.status === 'sold';

    card.innerHTML =
      '<div class="card-img-wrap">' +
        (product.image
          ? '<img src="' + product.image + '" alt="' + product.title + '">'
          : '<div class="placeholder-img">' + product.emoji + '</div>') +
        (isSold ? '<div class="sold-badge">' + t('sold_label') + '</div>' : '') +
      '</div>' +
      '<div class="card-body">' +
        '<div class="card-title">' + product.emoji + ' ' + product.title + '</div>' +
        '<div class="card-price">' + (isSold ? '<span class="sold-price">' + formatPrice(product.ton) + '</span>' : formatPrice(product.ton)) + '</div>' +
        '<div class="card-actions">' +
          '<button class="card-btn-detail" onclick="showDetail(' + product.id + ')">' + t('btn_details') + '</button>' +
          (isSold
            ? '<button class="card-btn card-btn-sold" disabled>' + t('sold_label') + '</button>'
            : '<button class="card-btn ' + (inCart ? 'in-cart' : '') + '" onclick="toggleCart(' + product.id + ')">' + (inCart ? t('btn_in_cart') : t('btn_buy')) + '</button>'
          ) +
        '</div>' +
      '</div>';
    grid.appendChild(card);
  });

  catalog.appendChild(grid);
}

function showDetail(id) {
  const product = products.find(function(p) { return p.id === id; });
  const inCart = cart.find(function(i) { return i.id === id; });
  const desc = (descriptions[lang] && descriptions[lang][id]) || (descriptions['ru'] && descriptions['ru'][id]);
  const images = product.images || (product.image ? [product.image] : null);

  var galleryHtml = '';
  if (images && images.length > 1) {
    galleryHtml =
      '<div class="gallery" id="gallery-' + id + '">' +
        '<div class="gallery-track" id="gallery-track-' + id + '">' +
          images.map(function(img) {
            return '<img src="' + img + '" alt="' + product.title + '" class="gallery-slide">';
          }).join('') +
        '</div>' +
        '<div class="gallery-dots" id="gallery-dots-' + id + '">' +
          images.map(function(img, i) {
            return '<div class="gallery-dot' + (i === 0 ? ' gallery-dot-active' : '') + '" onclick="galleryGoTo(' + id + ',' + i + ')"></div>';
          }).join('') +
        '</div>' +
      '</div>';
  } else if (product.image) {
    galleryHtml = '<img src="' + product.image + '" alt="' + product.title + '" class="detail-img">';
  } else {
    galleryHtml = '<div class="detail-placeholder">' + product.emoji + '</div>';
  }

  const page = document.getElementById('page-detail');
  page.innerHTML =
    '<header>' +
      '<button onclick="showPage(\'page-catalog\')">' + t('back') + '</button>' +
      '<h1>' + product.title + '</h1>' +
    '</header>' +
    '<div class="detail-content">' +
      galleryHtml +
      '<div class="detail-price">' + formatPrice(product.ton) + '</div>' +
      (desc
        ? '<div class="detail-desc">' + desc.replace(/\n/g, '<br>') + '</div>'
        : '<div class="detail-desc">' + product.description + '</div>') +
      (product.status === 'sold'
        ? '<button class="submit-btn in-cart-btn" disabled>' + t('sold_label') + '</button>'
        : '<button id="detail-cart-btn" class="submit-btn ' + (inCart ? 'in-cart-btn' : '') + '" onclick="detailToggleCart(' + id + ')">' + (inCart ? t('btn_in_cart_full') : t('btn_add_cart')) + '</button>'
      ) +
    '</div>';
  showPage('page-detail');

  if (images && images.length > 1) {
    initGallerySwipe(id, images.length);
  }
}

var galleryIndex = {};

function galleryGoTo(id, index) {
  var images = products.find(function(p) { return p.id === id; }).images;
  var total = images ? images.length : 1;
  if (index < 0) index = 0;
  if (index >= total) index = total - 1;
  galleryIndex[id] = index;
  var track = document.getElementById('gallery-track-' + id);
  if (track) track.style.transform = 'translateX(-' + (index * 100) + '%)';
  var dots = document.querySelectorAll('#gallery-dots-' + id + ' .gallery-dot');
  dots.forEach(function(d, i) {
    d.classList.toggle('gallery-dot-active', i === index);
  });
}

function initGallerySwipe(id, total) {
  var track = document.getElementById('gallery-track-' + id);
  if (!track) return;
  galleryIndex[id] = 0;
  track.style.transform = 'translateX(0%)';
  var startX = 0;
  var startY = 0;
  var isDragging = false;

  track.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = false;
  }, { passive: true });

  track.addEventListener('touchmove', function(e) {
    var diffX = startX - e.touches[0].clientX;
    var diffY = startY - e.touches[0].clientY;
    if (!isDragging && Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 5) {
      isDragging = true;
    }
    if (isDragging) {
      e.preventDefault();
    }
  }, { passive: false });

  track.addEventListener('touchend', function(e) {
    var diffX = startX - e.changedTouches[0].clientX;
    var diffY = startY - e.changedTouches[0].clientY;
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
      var current = galleryIndex[id] !== undefined ? galleryIndex[id] : 0;
      if (diffX > 0 && current < total - 1) {
        galleryGoTo(id, current + 1);
      } else if (diffX < 0 && current > 0) {
        galleryGoTo(id, current - 1);
      }
    }
    isDragging = false;
  }, { passive: true });
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
  if (product.status === 'sold') return;
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
        '<div class="production-stages">' +
          '<div class="production-stage"><img src="step1.png" class="stage-icon" alt=""><div class="stage-text"><div class="stage-name">Вы отправляете ссылку на подарок</div><div class="stage-desc">Мы получаем все детали вашего коллекционного подарка</div></div></div>' +
          '<div class="stage-connector"></div>' +
          '<div class="production-stage"><img src="step2.png" class="stage-icon" alt=""><div class="stage-text"><div class="stage-name">Мы готовим референс</div><div class="stage-desc">Художник изучает подарок и создаёт эскиз композиции</div></div></div>' +
          '<div class="stage-connector"></div>' +
          '<div class="production-stage"><img src="step3.png" class="stage-icon" alt=""><div class="stage-text"><div class="stage-name">Перенос на холст</div><div class="stage-desc">Художник переносит композицию на холст 30×30 см</div></div></div>' +
          '<div class="stage-connector"></div>' +
          '<div class="production-stage"><img src="step4.png" class="stage-icon" alt=""><div class="stage-text"><div class="stage-name">Написание маслом</div><div class="stage-desc">Пишем картину масляными красками, слой за слоем</div></div></div>' +
          '<div class="stage-connector"></div>' +
          '<div class="production-stage"><img src="step5.png" class="stage-icon" alt=""><div class="stage-text"><div class="stage-name">Фото на согласование</div><div class="stage-desc">Отправляем фото готовой работы для вашего одобрения</div></div></div>' +
          '<div class="stage-connector"></div>' +
          '<div class="production-stage"><img src="step6.png" class="stage-icon" alt=""><div class="stage-text"><div class="stage-name">Упаковка и отправка</div><div class="stage-desc">Упаковываем бережно и отправляем по всему миру</div></div></div>' +
        '</div>' +
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
          '<div class="autocomplete-wrap"><input type="text" id="custom-country" class="custom-input" placeholder="' + t('field_country') + '"></div>' +
          '<div class="autocomplete-wrap"><input type="text" id="custom-city" class="custom-input" placeholder="' + t('field_city') + '"></div>' +
          '<div class="autocomplete-wrap"><input type="text" id="custom-address" class="custom-input" placeholder="' + t('field_address') + '"></div>' +
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
       'Oil&Soul создаёт независимые картины маслом по мотивам коллекционных подарков Telegram. Проект не является официальным сервисом Telegram. Каждая работа — физическая художественная интерпретация цифрового подарка.' +
        '<button class="submit-btn" onclick="submitCustomOrder()">' + t('custom_submit') + '</button>' +
        '<button class="faq-link-btn" onclick="showFaqPage()">❓ Частые вопросы</button>' +
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
          '<span class="pay-btn-text"><strong>' + t('pay_wallet') + '</strong><small>' + t('pay_wallet_sub') + '</small></span>' +
        '</a>' +
        '<a href="' + tonkeeperLink + '" class="pay-btn pay-btn-tonkeeper">' +
          '<span class="pay-btn-icon">💎</span>' +
          '<span class="pay-btn-text"><strong>' + t('pay_tonkeeper') + '</strong><small>' + t('pay_tonkeeper_sub') + '</small></span>' +
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

const tg = window.Telegram?.WebApp;
if (tg) tg.expand();
// Track app open after SDK loads
window.addEventListener('load', function() {
  var user = tg && tg.initDataUnsafe && tg.initDataUnsafe.user;
  track('app_opened', {
    lang: tg && tg.initDataUnsafe && tg.initDataUnsafe.user ? tg.initDataUnsafe.user.language_code : null,
    platform: tg ? tg.platform : 'unknown'
  });
});

let cart = [];
let tonPrice = null;
let lang = 'ru';
let currentFilter = 'all';
let savedScrollY = 0;

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
    custom_step3: '3. Мы подтвердим заказ и пришлём реквизиты для оплаты',
    custom_step4: '4. После оплаты мы приступаем к работе',
    custom_gift_label: '🔗 Ссылка на ваш подарок',
    custom_gift_placeholder: 'https://t.me/nft/...',
    custom_gift_hint: 'Как получить: профиль → Мои подарки → нажмите на подарок → Поделиться → скопируйте ссылку',
    custom_delivery_label: '📦 Данные для доставки',
    custom_conditions_label: '💎 Условия заказа',
    custom_size: 'Размер',
    custom_price: 'Стоимость',
    custom_deadline: 'Срок',
    custom_nft: 'Уникальный номер на картине',
    custom_submit: '✅ Отправить заказ',
    custom_fill_fields: 'Пожалуйста заполните все поля, включая ссылку на подарок',
    custom_success: 'Заказ отправлен! Бот пришлёт реквизиты для оплаты.',
    filter_all: 'Все',
    filter_ready: 'В наличии',
    filter_custom: 'Под заказ',
    filter_sold: 'Продано',
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
    custom_nft: 'Unique number on the painting',
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
},
  ar: {
    header_title: '🎨 Oil&Soul',
    header_sub: 'لوحات زيتية بأسلوب هدايا Telegram',
    btn_details: 'التفاصيل',
    btn_buy: '+ شراء',
    btn_in_cart: '✓',
    btn_add_cart: '+ أضف إلى السلة',
    btn_in_cart_full: '✓ في السلة',
    cart_btn: 'إتمام الطلب →',
    checkout_title: 'تأكيد الطلب',
    back: '→ رجوع',
    back_catalog: '→ الكتالوج',
    order_title: '🛒 طلبك',
    order_total: 'المجموع:',
    delivery_title: '📦 بيانات التوصيل',
    field_name: 'الاسم الكامل *',
    field_country: 'الدولة *',
    field_city: 'المدينة *',
    field_address: 'العنوان (شارع، مبنى، شقة) *',
    field_postal: 'الرمز البريدي *',
    field_phone: 'رقم الهاتف *',
    field_email: 'البريد الإلكتروني *',
    field_comment: 'ملاحظات على الطلب (اختياري)',
    submit_btn: '✅ تأكيد الطلب',
    fill_fields: 'يرجى ملء جميع الحقول المطلوبة',
    connection_error: 'خطأ في الاتصال. حاول مرة أخرى.',
    payment_done: 'تم تقديم الطلب!',
    payment_sub: 'المبلغ المتبقي للدفع',
    pay_tonkeeper: 'الدفع عبر Tonkeeper',
    pay_tonkeeper_sub: 'تطبيق الهاتف',
    other_wallet: 'محفظة أخرى — انسخ العنوان:',
    amount: 'المبلغ:',
    copy: 'نسخ',
    payment_page_title: 'الدفع',
    after_payment: 'بعد التحويل راسلنا على',
    after_payment2: '— سنؤكد الاستلام ونبدأ التعبئة.',
    custom_page_title: 'لوحة من هديتك',
    custom_heading: '🎁 هديتك على القماش',
    custom_text: 'هل لديك هدية Telegram نادرة؟ Plush Pepe أو Homemade Cake أو Cyberpunk Skull — سنرسمها زيتاً على قماش. نسخة مادية فريدة من هديتك الرقمية.',
    custom_timeline: '⏱ مدة الرسم: 21 يوم + الشحن',
    custom_how_title: 'كيف يعمل:',
    custom_step1: '١. املأ النموذج أدناه',
    custom_step2: '٢. أرسل رابط هديتك على Telegram',
    custom_step3: '٣. نؤكد الطلب ونرسل تفاصيل الدفع',
    custom_step4: '٤. بعد الدفع نبدأ الرسم',
    custom_gift_label: '🔗 رابط هديتك',
    custom_gift_placeholder: 'https://t.me/nft/...',
    custom_gift_hint: 'كيف تحصل عليه: الملف الشخصي ← هداياي ← اضغط على الهدية ← مشاركة ← انسخ الرابط',
    custom_delivery_label: '📦 بيانات التوصيل',
    custom_conditions_label: '💎 شروط الطلب',
    custom_size: 'الحجم',
    custom_price: 'السعر',
    custom_deadline: 'المدة',
    custom_nft: 'رقم فريد على اللوحة',
    custom_submit: '✅ إرسال الطلب',
    custom_fill_fields: 'يرجى ملء جميع الحقول بما فيها رابط الهدية',
    custom_success: 'تم إرسال الطلب! سيرسل البوت تفاصيل الدفع.',
    filter_all: 'الكل',
    filter_ready: 'جاهز للشحن',
    filter_custom: 'طلب خاص',
    filter_sold: 'مباع',
    sold_label: 'مباع',
    custom_card_title: '🎁 لوحة من هديتك',
    custom_card_desc: 'اطلب لوحة زيتية بأسلوب هديتك على Telegram',
    custom_card_btn: 'اطلب →',
    faq_title: 'FAQ',
  }
};

// ─── Amplitude Analytics ─────────────────────────────────────────────────────
function track(event, props) {
  try {
    if (window.amplitude) {
      window.amplitude.track(event, props || {});
    }
  } catch(e) {}
}
// ─────────────────────────────────────────────────────────────────────────────

function t(key) {
  return i18n[lang][key] || key;
}

function setLang(l) {
  lang = l;
  track('language_changed', { lang: l });
  // update dropdown display
  var flags = { ru: '🇷🇺', en: '🇬🇧', ar: '🇸🇦' };
  var flagEl = document.getElementById('lang-current-flag');
  var codeEl = document.getElementById('lang-current-code');
  if (flagEl) flagEl.textContent = flags[l] || '';
  if (codeEl) codeEl.textContent = l.toUpperCase();

  var isRtl = l === 'ar';
  document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', l);
  document.body.style.fontFamily = isRtl ? "'Noto Sans Arabic', sans-serif" : "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

  var headerSub = document.getElementById('header-sub');
  if (headerSub) headerSub.textContent = t('header_sub');
  var heroTitle = document.getElementById('hero-title');
  if (heroTitle) heroTitle.innerHTML = l === 'ru' ? 'Цифровой подарок —<br>в настоящей<br>масляной живописи' : l === 'ar' ? 'هديتك الرقمية —<br>في لوحة زيتية حقيقية' : 'Your digital gift —<br>in a real<br>oil painting';
  var heroDesc = document.getElementById('hero-desc');
  if (heroDesc) heroDesc.textContent = t('header_sub');
  var feat1 = document.getElementById('feat-1');
  if (feat1) feat1.textContent = l === 'ru' ? 'Масло и холст' : l === 'ar' ? 'زيت وقماش' : 'Oil & canvas';
  var feat2 = document.getElementById('feat-2');
  if (feat2) feat2.textContent = l === 'ru' ? 'Доставка по всему миру' : l === 'ar' ? 'شحن دولي' : 'Worldwide shipping';
  var feat3 = document.getElementById('feat-3');
  if (feat3) feat3.textContent = l === 'ru' ? 'Оплата в TON' : l === 'ar' ? 'الدفع بـ TON' : 'Pay in TON';
  var customBtn = document.getElementById('custom-bar-btn');
  if (customBtn) customBtn.textContent = l === 'ar' ? '✍️ طلب خاص' : l === 'en' ? '✍️ Custom order' : '✍️ Под заказ';

  document.getElementById('checkout-btn').textContent = t('cart_btn');
  var _f = function(id, prop, val) { var el = document.getElementById(id); if (el) el[prop] = val; };
  _f('field-name',    'placeholder', t('field_name'));
  _f('field-country', 'placeholder', t('field_country'));
  _f('field-city',    'placeholder', t('field_city'));
  _f('field-address', 'placeholder', t('field_address'));
  _f('field-postal',  'placeholder', t('field_postal'));
  _f('field-phone',   'placeholder', t('field_phone'));
  _f('field-email',   'placeholder', t('field_email'));
  _f('field-comment', 'placeholder', t('field_comment'));
  _f('submit-btn',    'textContent', t('submit_btn'));
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
    { q: 'Можно ли заказать картину по моему Telegram-подарку?', a: 'Да. Вы отправляете ссылку на ваш Telegram-подарок, а мы создаём физическую картину маслом по его мотивам. На холсте можно указать номер вашего подарка.'  },
    { q: 'Будет ли картина точной копией подарка?', a: 'Картина создаётся вручную, поэтому она не является пиксельной копией 1 в 1. Мы сохраняем основные элементы подарка: форму, цвета, фон, настроение и уникальный номер, но итоговая работа остаётся живой масляной интерпретацией с фактурой мазков.' },
    { q: 'Что нужно отправить для кастомного заказа?', a: 'Нужно отправить ссылку на ваш Telegram-подарок. Формат: https://t.me/nft/... Также можно добавить комментарий, если есть пожелания по фону или деталям.' },
    { q: 'Сколько времени занимает написание картины?', a: 'Стандартный срок написания картины — 21 день. После завершения работы картина проходит финальную проверку, затем упаковывается и отправляется вам.' },
    { q: 'Как происходит заказ картины с моего подарка?', a: '1. Вы отправляете ссылку на Telegram-подарок\n2. Мы проверяем подарок и согласуем детали\n3. После оплаты мы приступаем к работе\n4. Картина проходит финальную проверку\n5. Мы оформляем сертификат уникальности\n6. Картина упаковывается и отправляется вам' },
    { q: 'Какие материалы используются?', a: 'Холст на подрамнике, масляные краски, художественные кисти и мастихины, защитный лак после высыхания, упаковка для безопасной доставки.' },
    { q: 'Доставляете ли вы по всему миру?', a: 'Да, мы отправляем картины по всему миру. Стоимость и срок доставки зависят от страны получателя и рассчитываются индивидуально после оформления заказа.' },
    { q: 'Как упаковывается картина?', a: 'Картина упаковывается в защитную упаковку. Мы используем плотную упаковку, защитные слои и коробку, подходящую под формат холста.' },
    { q: 'Как происходит оплата?', a: 'Оплата принимается в TON. После оформления заказа вы получите данные для оплаты. После подтверждения оплаты заказ передаётся в работу.' },
    { q: 'Можно ли вернуть картину?', a: 'Готовые работы обсуждаются индивидуально. Кастомные картины создаются специально под ваш Telegram-подарок, поэтому возврат таких работ обычно невозможен после начала написания. Если возникнет проблема — рассмотрим ситуацию отдельно.' },
    { q: 'Что входит в заказ?', a: 'Картина маслом на холсте, прокрашенные боковые стороны, Номер подарка на холсте (если предусмотрен), сертификат уникальности, защитная упаковка.' },
    { q: 'Что такое сертификат уникальности?', a: 'Сертификат подтверждает данные физической картины: название работы, номер подарка, техника (масло на холсте), размер, год создания и данные проекта Oil&Soul.' },
    { q: 'Будет ли QR-код на оригинальный Telegram-подарок?', a: 'Да, для кастомных работ можно добавить QR-код на обратную сторону картины. QR-код будет вести на ссылку оригинального Telegram-подарка. Наносится в виде аккуратной печатной наклейки.' },
  ],
  en: [
    { q: 'What is Oil&Soul?', a: 'Oil&Soul is a service that turns digital Telegram gifts into physical oil paintings on canvas. We create ready-made works and custom paintings based on your Telegram collectible gift link. Each work comes with a certificate of uniqueness.' },
    { q: 'Is it a real painting or a print?', a: 'It is a real painting, hand-painted with oil paints on canvas. Not a print, not a poster, not a digital reproduction. Each work has the live texture of brushstrokes and comes with a certificate of uniqueness.' },
    { q: 'What size is the painting?', a: 'The base format is 30×30 cm. The painting is made on a stretched canvas. The sides are painted, so the work can be displayed without a frame.' },
    { q: 'Can I order a painting based on my Telegram gift?', a: 'Yes. You send a link to your Telegram gift and we create a physical oil painting inspired by it. The unique number of your gift can be included on the canvas.' },
    { q: 'Will the painting be an exact copy of the gift?', a: 'The painting is handmade, so it is not a pixel-perfect 1:1 copy. We preserve the key elements: shape, colors, background, mood and unique number — but the final work remains a live oil interpretation with brushstroke texture.' },
    { q: 'What do I need to send for a custom order?', a: 'Send a link to your Telegram gift. Format: https://t.me/nft/... You can also add a comment if you have wishes regarding the background or details.' },
    { q: 'How long does painting take?', a: 'The standard painting time is 21 days. After completion, the painting goes through a final check, then gets packaged and shipped to you.' },
    { q: 'How does a custom order work?', a: '1. You send a link to your Telegram gift\n2. We check the gift and agree on details\n3. After payment we start working\n4. The painting passes a final check\n5. We prepare the certificate of uniqueness\n6. The painting is packaged and shipped to you' },
    { q: 'What materials are used?', a: 'Stretched canvas, oil paints, artist brushes and palette knives, protective varnish after drying, packaging for safe delivery.' },
    { q: 'Do you ship worldwide?', a: 'Yes, we ship paintings worldwide. The cost and time of delivery depend on the recipient\'s country and are calculated individually after placing an order.' },
    { q: 'How is the painting packaged?', a: 'The painting is packed in protective packaging. We use dense packing, protective layers and a box suitable for the canvas format.' },
    { q: 'How does payment work?', a: 'Payment is accepted in TON. After placing an order you will receive payment details. After payment confirmation the order goes into production.' },
    { q: 'Can I return a painting?', a: 'Ready-made works are discussed individually. Custom paintings are created specifically for your Telegram gift, so returns are usually not possible after painting has started. If a problem arises we will consider the situation separately.' },
    { q: 'What is included in the order?', a: 'Oil painting on canvas, painted sides, Unique number on canvas (if applicable), certificate of uniqueness, protective packaging.' },
    { q: 'What is the certificate of uniqueness?', a: 'The certificate confirms the physical painting data: title, unique number, technique (oil on canvas), size, year of creation and Oil&Soul project details.' },
    { q: 'Will there be a QR code for the original Telegram gift?', a: 'Yes, for custom works a QR code can be added to the back of the painting. It will link to the original Telegram gift. Applied as a neat printed sticker.' },
  ]
};

function showPage(pageId) {
  document.getElementById('page-catalog').classList.add('hidden');
  document.getElementById('page-checkout').classList.add('hidden');
  document.getElementById('page-detail').classList.add('hidden');
  document.getElementById(pageId).classList.remove('hidden');

  var floatBtn = document.getElementById('float-back-btn');
  if (floatBtn) { if (floatBtn._removeScroll) floatBtn._removeScroll(); floatBtn.remove(); }

  if (pageId === 'page-catalog') {
    setTimeout(function() { window.scrollTo(0, savedScrollY); }, 50);
  } else {
    window.scrollTo(0, 0);
    if (pageId === 'page-detail') {
      var btn = document.createElement('button');
      btn.id = 'float-back-btn';
      btn.textContent = '← Назад';
      btn.style.cssText = 'position:fixed;bottom:80px;right:16px;z-index:999;padding:10px 18px;background:rgba(15,30,56,0.92);border:1px solid rgba(255,255,255,0.15);border-radius:20px;color:rgba(255,255,255,0.75);font-size:13px;font-weight:600;cursor:pointer;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);opacity:0;transition:opacity 0.3s;box-shadow:0 4px 16px rgba(0,0,0,0.4);';
      btn.onclick = function() {
        btn.style.opacity = '0';
        setTimeout(function() { showPage('page-catalog'); }, 200);
      };
      document.body.appendChild(btn);
      function onScroll() { btn.style.opacity = window.scrollY > 80 ? '1' : '0'; }
      window.addEventListener('scroll', onScroll);
      btn._removeScroll = function() { window.removeEventListener('scroll', onScroll); };
    }
  }
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

function toggleMainFaq(i) {
  var answer = document.getElementById('main-faq-answer-' + i);
  var arrow = document.getElementById('main-faq-arrow-' + i);
  if (!answer) return;
  var isOpen = answer.classList.contains('faq-open');
  document.querySelectorAll('[id^="main-faq-answer-"]').forEach(function(el) { el.classList.remove('faq-open'); });
  document.querySelectorAll('[id^="main-faq-arrow-"]').forEach(function(el) { el.textContent = '▾'; });
  if (!isOpen) {
    answer.classList.add('faq-open');
    arrow.textContent = '▴';
  }
}

function setFilter(filter) {
  currentFilter = filter;
  track('catalog_filtered', { filter: filter });
  renderCatalog();
}

function renderCatalog() {
  const catalog = document.getElementById('catalog');
  catalog.innerHTML = '';

  const filterBar = document.createElement('div');
  filterBar.className = 'filter-bar-seg';
  filterBar.innerHTML =
    '<button onclick="setFilter(\'all\')" style="border-right:1px solid rgba(255,255,255,0.1);" class="filter-seg-btn' + (currentFilter === 'all' ? ' filter-seg-active' : '') + '">' + t('filter_all') + '</button>' +
    '<button onclick="setFilter(\'ready\')" style="border-right:1px solid rgba(255,255,255,0.1);" class="filter-seg-btn' + (currentFilter === 'ready' ? ' filter-seg-active' : '') + '">' + t('filter_ready') + '</button>' +
    '<button onclick="setFilter(\'custom\')" class="filter-seg-btn' + (currentFilter === 'custom' ? ' filter-seg-active' : '') + '">' + t('filter_custom') + '</button>';
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
        '<div class="custom-order-card-price">99 TON' + (tonPrice ? ' (~$' + (99 * tonPrice.usd).toFixed(0) + ')' : '') + '</div>' +
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
    empty.textContent = 'Нет работ в этой категории';
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

  // FAQ and footer go OUTSIDE the catalog grid, into the parent main element
  const mainEl = catalog.parentNode;

  // Remove old FAQ/footer if re-rendering
  var oldFaq = document.getElementById('main-faq-section');
  if (oldFaq) oldFaq.remove();
  var oldFooter = document.getElementById('main-footer');
  if (oldFooter) oldFooter.remove();

  // FAQ section on main page
  const faqSection = document.createElement('div');
  faqSection.id = 'main-faq-section';
  faqSection.style.cssText = 'padding: 8px 16px 8px;';
  const faqItems_main = faqItems[lang] || faqItems['ru'];
  faqSection.innerHTML =
    '<div style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.35);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px;padding-top:4px;">FAQ</div>' +
    '<div class="faq-list">' +
      faqItems_main.slice(0, 3).map(function(item, i) {
        return '<div class="faq-item" id="main-faq-' + i + '">' +
          '<div class="faq-question" onclick="toggleMainFaq(' + i + ')">' +
            '<span>' + item.q + '</span>' +
            '<span class="faq-arrow" id="main-faq-arrow-' + i + '">▾</span>' +
          '</div>' +
          '<div class="faq-answer" id="main-faq-answer-' + i + '">' + item.a.replace(/\n/g, '<br>') + '</div>' +
        '</div>';
      }).join('') +
    '</div>' +
    '';
  mainEl.appendChild(faqSection);

  // Footer with support - inline with "all questions" button
  const footer = document.createElement('div');
  footer.id = 'main-footer';
  footer.style.cssText = 'padding: 4px 16px 20px; display:flex; justify-content:space-between; align-items:center; box-sizing:border-box; width:100%;';
  footer.innerHTML =
    '<button onclick="showFaqPage()" style="background:transparent;border:none;padding:4px 0;color:rgba(255,255,255,0.4);font-size:13px;cursor:pointer;flex-shrink:0;">Все вопросы →</button>' +
    '<a href="https://t.me/oilsoul_support" target="_blank" style="display:inline-flex;align-items:center;gap:6px;padding:7px 12px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:rgba(255,255,255,0.45);font-size:13px;text-decoration:none;flex-shrink:0;max-width:60%;">💬 @oilsoul_support</a>';
  mainEl.appendChild(footer);
}

function showDetail(id) {
  var p = products.find(function(x){ return x.id === id; });
  if (p) track('product_viewed', { product_id: id, title: p.title });
  savedScrollY = window.scrollY;
  const product = products.find(function(p) { return p.id === id; });
  const inCart = cart.find(function(i) { return i.id === id; });
  const desc = (descriptions[lang] && descriptions[lang][id]) || (descriptions['ru'] && descriptions['ru'][id]);
  const images = product.images || (product.image ? [product.image] : null);

  var galleryHtml = '';
  if (images && images.length > 1) {
    galleryHtml =
      '<div class="gallery" id="gallery-' + id + '" style="position:relative;width:100%;overflow:hidden;border-radius:16px;">' +
        '<div class="gallery-track" id="gallery-track-' + id + '" style="display:flex;transition:transform 0.3s ease;">' +
          images.map(function(img) {
            return '<img src="' + img + '" alt="' + product.title + '" style="width:100%;flex-shrink:0;aspect-ratio:1;object-fit:cover;">';
          }).join('') +
        '</div>' +
        '<button onclick="galleryGoTo(' + id + ', (galleryIndex[' + id + ']||0) - 1)" style="position:absolute;left:8px;top:50%;transform:translateY(-50%);width:36px;height:36px;border-radius:50%;background:rgba(0,0,0,0.5);border:none;color:white;font-size:22px;cursor:pointer;z-index:10;display:flex;align-items:center;justify-content:center;padding:0;">&#8249;</button>' +
        '<button onclick="galleryGoTo(' + id + ', (galleryIndex[' + id + ']||0) + 1)" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);width:36px;height:36px;border-radius:50%;background:rgba(0,0,0,0.5);border:none;color:white;font-size:22px;cursor:pointer;z-index:10;display:flex;align-items:center;justify-content:center;padding:0;">&#8250;</button>' +
        '<div id="gallery-dots-' + id + '" style="display:flex;justify-content:center;gap:6px;padding:10px 0 4px;">' +
          images.map(function(img, i) {
            return '<div class="gallery-dot' + (i === 0 ? ' gallery-dot-active' : '') + '" onclick="galleryGoTo(' + id + ',' + i + ')" style="width:' + (i === 0 ? '18px' : '6px') + ';height:6px;border-radius:3px;background:' + (i === 0 ? '#f0c040' : 'rgba(255,255,255,0.2)') + ';cursor:pointer;transition:all 0.2s;"></div>';
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
  galleryIndex[id] = 0;
}

var galleryIndex = {};

function galleryGoTo(id, index) {
  var product = products.find(function(p) { return p.id === id; });
  var images = product.images || (product.image ? [product.image] : null);
  var total = images ? images.length : 1;
  if (index < 0) index = 0;
  if (index >= total) index = total - 1;
  galleryIndex[id] = index;
  var track = document.getElementById('gallery-track-' + id);
  if (track) track.style.transform = 'translateX(-' + (index * 100) + '%)';
  var dots = document.querySelectorAll('#gallery-dots-' + id + ' .gallery-dot');
  dots.forEach(function(d, i) {
    d.style.background = (i === index) ? '#f0c040' : 'rgba(255,255,255,0.2)';
    d.style.width = (i === index) ? '18px' : '6px';
    d.style.borderRadius = '3px';
    d.style.transition = 'all 0.2s';
  });
}

function detailToggleCart(id) {
  toggleCart(id);
  const btn = document.getElementById('detail-cart-btn');
  if (!btn) return;
  const inCart = cart.find(function(i) { return i.id === id; });
  if (inCart) {
    btn.className = 'submit-btn in-cart-btn';
    btn.textContent = t('btn_in_cart_full');
    var existing = document.getElementById('detail-checkout-btn');
    if (!existing) {
      var checkoutBtn = document.createElement('button');
      checkoutBtn.id = 'detail-checkout-btn';
      checkoutBtn.className = 'submit-btn';
      checkoutBtn.style.marginTop = '10px';
      checkoutBtn.textContent = t('cart_btn');
      checkoutBtn.onclick = function() {
        renderCheckout();
        showPage('page-checkout');
      };
      btn.parentNode.insertBefore(checkoutBtn, btn.nextSibling);
    }
  } else {
    btn.className = 'submit-btn';
    btn.textContent = t('btn_add_cart');
    var existing = document.getElementById('detail-checkout-btn');
    if (existing) existing.remove();
  }
}

function toggleCart(id) {
  var p = products.find(function(x){ return x.id === id; });
  var inCart = cart.find(function(i){ return i.id === id; });
  if (p && !inCart) track('add_to_cart', { product_id: id, title: p.title, price: p.ton });
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

var deliveryMethod = 'cdek';
var cdekSelectedPvz = null;

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
      '<span id="checkout-total-display">' + totalTon + ' TON' + (tonPrice ? ' (~$' + (totalTon * tonPrice.usd).toFixed(0) + ')' : '') + '</span>' +
    '</div>';
  document.getElementById('ton-amount').textContent = totalTon;
  document.getElementById('ton-address-display').textContent = TON_WALLET;
  document.querySelector('#page-checkout header h1').textContent = t('checkout_title');
  document.getElementById('back-btn').textContent = t('back');
  // Reset submit button and consent on each checkout open
  var submitBtn = document.getElementById('submit-btn');
  var consentBox = document.getElementById('field-consent');
  if (submitBtn) {
    submitBtn.textContent = t('submit_btn');
    submitBtn.style.opacity = '0.5';
    submitBtn.style.cursor = 'not-allowed';
  }
  if (consentBox) consentBox.checked = false;

  // Update placeholders for current language
  var _f = function(id, val) { var el = document.getElementById(id); if (el) el.placeholder = val; };
  _f('field-name',    t('field_name'));
  _f('field-country', t('field_country'));
  _f('field-city',    t('field_city'));
  _f('field-address', t('field_address'));
  _f('field-postal',  t('field_postal'));
  _f('field-phone',   t('field_phone'));
  _f('field-email',   t('field_email'));
  _f('field-comment', t('field_comment'));

  // Email validation
  var emailEl = document.getElementById('field-email');
  if (emailEl && !emailEl._validationAttached) {
    emailEl._validationAttached = true;
    // Add error div if not exists
    if (!document.getElementById('email-error')) {
      var errDiv = document.createElement('div');
      errDiv.id = 'email-error';
      errDiv.style.cssText = 'display:none;color:#e05c5c;font-size:12px;margin:-8px 0 4px 4px;';
      emailEl.parentNode.insertBefore(errDiv, emailEl.nextSibling);
    }
    emailEl.addEventListener('input', function() {
      var val = this.value.trim();
      var errEl = document.getElementById('email-error');
      if (!errEl) return;
      if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        errEl.textContent = lang === 'ar' ? 'صيغة البريد الإلكتروني غير صحيحة' : lang === 'en' ? 'Invalid email format' : 'Неверный формат email';
        errEl.style.display = 'block';
      } else {
        errEl.style.display = 'none';
      }
    });
  }

  // Init Google Places autocomplete
  setTimeout(function() {
    if (window.googleMapsReady) initCheckoutAutocomplete();
  }, 100);
}


function dvSearchCountry(val) {
  var list = document.getElementById('dv-country-list');
  if (val.length < 2) { list.style.display = 'none'; return; }
  fetch('https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(val) + '&format=json&limit=7&addressdetails=1&accept-language=ru&featuretype=country')
    .then(function(r) { return r.json(); })
    .then(function(results) {
      list.innerHTML = '';
      var seen = {};
      results.forEach(function(item) {
        var country = item.address && item.address.country;
        if (!country || seen[country]) return;
        seen[country] = true;
        var div = document.createElement('div');
        div.className = 'dv-autocomplete-item';
        div.textContent = country;
        div.onmousedown = function(e) {
          e.preventDefault();
          document.getElementById('dv-country-input').value = country;
          list.style.display = 'none';
          var isRussia = country.toLowerCase().indexOf('росси') !== -1 || country.toLowerCase() === 'russia';
          document.getElementById('dv-russia').style.display = isRussia ? 'block' : 'none';
          document.getElementById('dv-intl').style.display = isRussia ? 'none' : 'block';
          if (!isRussia) {
            var intlCountry = document.getElementById('dv-intl-country');
            if (intlCountry) intlCountry.value = country;
          }
        };
        list.appendChild(div);
      });
      list.style.display = list.children.length ? 'block' : 'none';
    }).catch(function() { list.style.display = 'none'; });
}

function selectDvMethod(method) {
  deliveryMethod = method;
  var cdekCard = document.getElementById('dv-method-cdek');
  var postCard = document.getElementById('dv-method-post');
  var cdekRadio = document.getElementById('dv-radio-cdek');
  var postRadio = document.getElementById('dv-radio-post');
  var cdekBlock = document.getElementById('dv-cdek-block');
  var postBlock = document.getElementById('dv-post-block');
  if (method === 'cdek') {
    cdekCard.className = 'dv-method-card dv-method-active';
    postCard.className = 'dv-method-card';
    cdekRadio.className = 'dv-radio dv-radio-on';
    postRadio.className = 'dv-radio';
    cdekBlock.style.display = 'block';
    postBlock.style.display = 'none';
  } else {
    postCard.className = 'dv-method-card dv-method-active';
    cdekCard.className = 'dv-method-card';
    postRadio.className = 'dv-radio dv-radio-on';
    cdekRadio.className = 'dv-radio';
    postBlock.style.display = 'block';
    cdekBlock.style.display = 'none';
  }
}

function dvSearchCity(val) {
  var list = document.getElementById('dv-cdek-city-list');
  var pvzSection = document.getElementById('dv-pvz-section');

  // Show PVZ button as soon as user types something
  if (pvzSection) pvzSection.style.display = val.length >= 2 ? 'block' : 'none';

  if (val.length < 2) { list.style.display = 'none'; return; }
  fetch('https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(val + ', Россия') + '&format=json&limit=5&addressdetails=1&accept-language=ru')
    .then(function(r) { return r.json(); })
    .then(function(results) {
      list.innerHTML = '';
      var seen = {};
      results.forEach(function(item) {
        var city = item.address && (item.address.city || item.address.town || item.address.village);
        if (!city || seen[city]) return;
        seen[city] = true;
        var div = document.createElement('div');
        div.className = 'dv-autocomplete-item';
        div.textContent = city;
        div.onmousedown = function(e) {
          e.preventDefault();
          document.getElementById('dv-cdek-city').value = city;
          list.style.display = 'none';
          if (pvzSection) pvzSection.style.display = 'block';
        };
        list.appendChild(div);
      });
      list.style.display = list.children.length ? 'block' : 'none';
    }).catch(function() { list.style.display = 'none'; });
}

function dvShowPvzIfCity() {
  var city = (document.getElementById('dv-cdek-city') || {}).value || '';
  var pvzSection = document.getElementById('dv-pvz-section');
  if (pvzSection && city.trim().length >= 2) {
    pvzSection.style.display = 'block';
  }
}

function dvOpenCdekMap() {
  var city = (document.getElementById('dv-cdek-city') || {}).value || '';
  if (!city) { alert('Сначала введите город'); return; }

  // Show CDEK widget overlay
  var overlay = document.createElement('div');
  overlay.id = 'cdek-widget-overlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#0d1f38;z-index:9999;display:flex;flex-direction:column;';

  overlay.innerHTML =
    '<div style="display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid rgba(255,255,255,0.1);">' +
      '<button onclick="dvCloseCdekMap()" style="background:transparent;border:none;color:rgba(255,255,255,0.7);font-size:14px;cursor:pointer;padding:4px 0;">← Назад</button>' +
      '<span style="font-size:15px;font-weight:600;color:#fff;">Выберите пункт выдачи</span>' +
    '</div>' +
    '<div id="cdek-map-container" style="flex:1;overflow:hidden;"></div>';

  document.body.appendChild(overlay);

  // Load CDEK widget script
  var script = document.createElement('script');
  script.src = 'https://widget.cdek.ru/widget/widgetviewer.js';
  script.onload = function() {
    try {
      new CDEKWidget({
        from: { country_code: 'RU', city: city },
        root: 'cdek-map-container',
        apiKey: '',
        canChoose: true,
        servicePath: '',
        lang: 'rus',
        currency: 'RUB',
        tariffs: { office: [234, 136] },
        onChoose: function(type, tariff, address) {
          // address contains selected pickup point data
          var pvzAddress = address.address || address.name || '';
          var pvzCode = address.id || '';
          var pvzName = address.name || '';
          var pvzWorkTime = address.work_time || '';

          document.getElementById('dv-cdek-pvz-manual').value = pvzAddress;
          document.getElementById('dv-cdek-pvz-manual').style.display = 'none';

          var pvzSel = document.getElementById('dv-pvz-selected');
          pvzSel.style.display = 'block';
          pvzSel.innerHTML =
            '<div class="dv-pvz-card">' +
              '<div class="dv-pvz-addr">📍 ' + pvzName + '</div>' +
              '<div class="dv-pvz-address-line">' + pvzAddress + '</div>' +
              (pvzWorkTime ? '<div class="dv-pvz-time">' + pvzWorkTime + '</div>' : '') +
              '<button class="dv-pvz-change" onclick="dvOpenCdekMap()">Изменить пункт выдачи</button>' +
            '</div>';

          // Store for order submission
          window._cdekPvzCode = pvzCode;
          window._cdekPvzAddress = pvzAddress;
          window._cdekPvzName = pvzName;
          window._cdekPvzWorkTime = pvzWorkTime;

          dvCloseCdekMap();
        }
      });
    } catch(e) {
      // Fallback if widget fails
      dvCloseCdekMap();
      var manualInput = document.getElementById('dv-cdek-pvz-manual');
      if (manualInput) {
        manualInput.style.display = 'block';
        var pvzSel = document.getElementById('dv-pvz-selected');
        pvzSel.style.display = 'block';
        pvzSel.innerHTML = '<div class="dv-pvz-hint">Введите адрес пункта выдачи СДЭК вручную:</div>';
      }
    }
  };
  script.onerror = function() {
    dvCloseCdekMap();
    var manualInput = document.getElementById('dv-cdek-pvz-manual');
    if (manualInput) manualInput.style.display = 'block';
  };
  document.head.appendChild(script);
}

function dvCloseCdekMap() {
  var overlay = document.getElementById('cdek-widget-overlay');
  if (overlay) overlay.remove();
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
          '<div class="production-stage"><img src="step2.png" class="stage-icon" alt=""><div class="stage-text"><div class="stage-name">Мы готовим референс</div><div class="stage-desc">Изучаем подарок и создаём эскиз композиции</div></div></div>' +
          '<div class="stage-connector"></div>' +
          '<div class="production-stage"><img src="step3.png" class="stage-icon" alt=""><div class="stage-text"><div class="stage-name">Перенос на холст</div><div class="stage-desc">Переносим композицию на холст 30×30 см</div></div></div>' +
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
          '<div class="custom-condition-row"><span>' + t('custom_price') + '</span><span class="custom-condition-value">99 TON' + (tonPrice ? ' (~$' + (99 * tonPrice.usd).toFixed(0) + ')' : '') + '</span></div>' +
          '<div class="custom-condition-row"><span>' + t('custom_deadline') + '</span><span>21 день + доставка</span></div>' +
          '<div class="custom-condition-row"><span>' + t('custom_nft') + '</span><span>✓</span></div>' +
        '</div>' +
        '<div class="custom-disclaimer">Oil&Soul создаёт независимые картины маслом по мотивам коллекционных подарков Telegram. Проект не является официальным сервисом Telegram. Каждая работа — физическая художественная интерпретация цифрового подарка.</div>' +
        '<button class="submit-btn" onclick="submitCustomOrder()">' + t('custom_submit') + '</button>' +
        '<button class="faq-link-btn" onclick="showFaqPage()">FAQ</button>' +
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
  const orderId = 'OS-' + Math.random().toString(36).substring(2, 6).toUpperCase();

  const orderData = {
    action: 'custom_order',
    chat_id: user ? user.id : null,
    user_name: user ? ((user.first_name || '') + ' ' + (user.last_name || '')).trim() : name,
    gift_link: giftLink,
    order_id: orderId,
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
          '<div class="payment-success-sub">Проверьте чат с @OilSoulBot — там реквизиты для оплаты.</div>' +
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
  track('checkout_opened', { items: cart.length });
  showPage('page-checkout');
});

document.getElementById('back-btn').addEventListener('click', function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(function() { showPage('page-catalog'); }, 300);
});

document.getElementById('submit-btn').addEventListener('click', async function() {
  var consent = document.getElementById('field-consent');
  if (consent && !consent.checked) {
    alert(lang === 'en' ? 'Please accept the privacy policy' : 'Пожалуйста, примите политику конфиденциальности');
    return;
  }

  var name    = (document.getElementById('field-name')    || {value:''}).value.trim();
  var country = (document.getElementById('field-country') || {value:''}).value.trim();
  var city    = (document.getElementById('field-city')    || {value:''}).value.trim();
  var address = (document.getElementById('field-address') || {value:''}).value.trim();
  var apt     = (document.getElementById('field-apt')     || {value:''}).value.trim();
  var postal  = (document.getElementById('field-postal')  || {value:''}).value.trim();
  var phone   = (document.getElementById('field-phone')   || {value:''}).value.trim();
  var email   = (document.getElementById('field-email')   || {value:''}).value.trim();
  var comment = (document.getElementById('field-comment') || {value:''}).value.trim();

  if (!name || !country || !city || !address || !postal || !phone || !email) {
    alert(t('fill_fields')); return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    var emailErr = document.getElementById('email-error');
    if (emailErr) { emailErr.style.display = 'block'; emailErr.textContent = lang === 'ar' ? 'صيغة البريد الإلكتروني غير صحيحة' : lang === 'en' ? 'Invalid email format' : 'Неверный формат email'; }
    alert(lang === 'en' ? 'Invalid email format' : 'Неверный формат email'); return;
  }

  var fullAddress = address + (apt ? ', кв. ' + apt : '');

  var delivery = {
    recipientName: name,
    deliveryCountry: country,
    city: city,
    address: fullAddress,
    postalCode: postal,
    recipientPhone: phone,
    recipientEmail: email,
    comment: comment
  };

  const user = tg && tg.initDataUnsafe && tg.initDataUnsafe.user;
  const totalTon = cart.reduce(function(sum, i) { return sum + i.ton; }, 0);
  const orderId = 'OS-' + Math.random().toString(36).substring(2, 6).toUpperCase();
  const orderData = {
    action: 'order',
    chat_id: user ? user.id : null,
    user_name: user ? ((user.first_name || '') + ' ' + (user.last_name || '')).trim() : delivery.recipientName,
    items: cart.map(function(i) { return { id: i.id, title: i.title, ton: i.ton }; }),
    total_ton: totalTon,
    order_id: orderId,
    delivery: delivery
  };

  try {
    const res = await fetch('https://oilsoul-bot.onrender.com/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderData) });
    const result = await res.json();
    if (result.ok) {
      track('order_placed', { order_id: orderId, total_gram: totalTon });
      showPayment(totalTon, orderId);
    }
  } catch (e) { alert(t('connection_error')); }
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

function showPayment(totalTon, orderId) {
  cart = [];
  updateCartBar();

  var amountNano = Math.round(totalTon * 1e9);
  var tonkeeperLink = 'https://app.tonkeeper.com/transfer/' + TON_WALLET + '?amount=' + amountNano + '&text=' + orderId;
  window._tonkeeperLink = tonkeeperLink;

  var amountDisplay = totalTon + ' GRAM' + (tonPrice ? ' (~$' + (totalTon * tonPrice.usd).toFixed(0) + ')' : '');
  var shortWallet = TON_WALLET.substring(0, 10) + '...' + TON_WALLET.substring(TON_WALLET.length - 6);

  var page = document.getElementById('page-detail');
  page.innerHTML =
    '<header>' +
      '<button onclick="showPage(\'page-checkout\')">← ' + t('back') + '</button>' +
      '<h1>' + t('payment_page_title') + '</h1>' +
    '</header>' +
    '<div class="detail-content">' +
      '<div class="payment-success-icon">\ud83d\udc8e</div>' +
      '<div class="payment-success-title">' + t('payment_done') + '</div>' +
      '<div class="payment-success-sub">' + t('payment_sub') + ' ' + amountDisplay + '</div>' +
      '<div class="payment-requisites">' +
        '<div class="payment-req-label">\u0420\u0435\u043a\u0432\u0438\u0437\u0438\u0442\u044b \u0434\u043b\u044f \u043e\u043f\u043b\u0430\u0442\u044b</div>' +
        '<div class="payment-req-row">' +
          '<div class="payment-req-name">\u0410\u0434\u0440\u0435\u0441 \u043a\u043e\u0448\u0435\u043b\u044c\u043a\u0430</div>' +
          '<div class="payment-req-content">' +
            '<div class="payment-req-value">' + shortWallet + '</div>' +
            '<button class="copy-btn" onclick="copyToClipboard(\'' + TON_WALLET + '\', this)">' + t('copy') + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="payment-req-divider"></div>' +
        '<div class="payment-req-row">' +
          '<div class="payment-req-name">\u0421\u0443\u043c\u043c\u0430</div>' +
          '<div class="payment-req-content">' +
            '<div class="payment-req-value payment-req-amount">' + totalTon + ' GRAM</div>' +
            '<button class="copy-btn" onclick="copyToClipboard(\'' + totalTon + '\', this)">' + t('copy') + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="payment-req-divider"></div>' +
        '<div class="payment-req-row">' +
          '<div class="payment-req-name">\u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439</div>' +
          '<div class="payment-req-content">' +
            '<div class="payment-req-value payment-req-order">' + orderId + '</div>' +
            '<button class="copy-btn" onclick="copyToClipboard(\'' + orderId + '\', this)">' + t('copy') + '</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="payment-note-info">\u0423\u043a\u0430\u0436\u0438\u0442\u0435 \u043d\u043e\u043c\u0435\u0440 \u0437\u0430\u043a\u0430\u0437\u0430 \u0432 \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0438 \u043a \u043f\u0435\u0440\u0435\u0432\u043e\u0434\u0443 \u2014 \u043e\u043f\u043b\u0430\u0442\u0430 \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0441\u044f \u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0438</div>' +
      '<div class="payment-buttons">' +
        '<button class="pay-btn pay-btn-tonconnect" onclick="payWithTonConnect(' + totalTon + ', \'' + orderId + '\')">' +
          '<span class="pay-btn-icon">\ud83d\udc8e</span>' +
          '<span class="pay-btn-text"><strong>\u041e\u043f\u043b\u0430\u0442\u0438\u0442\u044c \u0447\u0435\u0440\u0435\u0437 \u043a\u043e\u0448\u0435\u043b\u0451\u043a</strong><small>TON Connect</small></span>' +
        '</button>' +
        '<button class="pay-btn pay-btn-tonkeeper" onclick="openTonkeeper()">' +
          '<span class="pay-btn-icon">\ud83d\udd35</span>' +
          '<span class="pay-btn-text"><strong>' + t('pay_tonkeeper') + '</strong><small>' + t('pay_tonkeeper_sub') + '</small></span>' +
        '</button>' +

      '</div>' +
      '<div id="tc-status" style="text-align:center;font-size:13px;color:rgba(255,255,255,0.5);margin-top:8px;padding:0 16px;"></div>' +
    '</div>';

  showPage('page-detail');
  window._currentOrderId = orderId;
  window._currentAmountNano = amountNano;
  initTonConnect();
}

var _tonConnectUI = null;

function initTonConnect() {
  try {
    if (typeof TON_CONNECT_UI !== 'undefined' && !_tonConnectUI) {
      _tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
        manifestUrl: 'https://oilsoul.shop/tonconnect-manifest.json',
        buttonRootId: null
      });
    }
  } catch(e) {
    console.log('TON Connect init error:', e);
  }
}

async function payWithTonConnect(totalTon, orderId) {
  track('payment_initiated', { method: 'ton_connect', amount: totalTon });
  var statusEl = document.getElementById('tc-status');
  if (!_tonConnectUI) { initTonConnect(); }
  if (!_tonConnectUI) {
    if (statusEl) statusEl.textContent = 'TON Connect недоступен. Используйте Tonkeeper.';
    return;
  }
  try {
    if (statusEl) statusEl.textContent = 'Подключаем кошелёк...';
    if (!_tonConnectUI.connected) { await _tonConnectUI.connectWallet(); }
    if (statusEl) statusEl.textContent = 'Отправляем транзакцию...';
    var tx = {
      validUntil: Math.floor(Date.now() / 1000) + 600,
      messages: [{ address: TON_WALLET, amount: String(Math.round(totalTon * 1e9)) }]
    };
    await _tonConnectUI.sendTransaction(tx);
    if (statusEl) statusEl.textContent = '✅ Транзакция отправлена! Ожидаем подтверждения...';
    track('payment_sent', { method: 'ton_connect' });
  } catch(e) {
    console.log('TON Connect error:', e);
    if (statusEl) statusEl.textContent = 'Ошибка. Попробуйте через Tonkeeper.';
  }
}

function openTonkeeper() {
  track('payment_initiated', { method: 'tonkeeper' });
  openExternalLink(window._tonkeeperLink || '');
}

function openExternalLink(url) {
  try {
    if (tg && tg.openLink) {
      tg.openLink(url);
    } else {
      window.open(url, '_blank');
    }
  } catch(e) {
    window.open(url, '_blank');
  }
}


fetchTonPrice();
renderCatalog();

// Inject currency switcher styles
(function() {
  var style = document.createElement('style');
  style.textContent = `


  `;
  document.head.appendChild(style);
})();

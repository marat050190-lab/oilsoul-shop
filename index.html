<!DOCTYPE html>
<html lang="ru" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Noto+Sans+Arabic:wght@400;600;700&display=swap" rel="stylesheet">
  <title>Oil&Soul</title>
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
  <link rel="stylesheet" href="style.css">
  <style>
    .privacy-modal-overlay {
      display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.7); z-index: 9999; align-items: center; justify-content: center;
    }
    .privacy-modal-overlay.active { display: flex; }
    .privacy-modal {
      background: #1a2b40; border: 1px solid rgba(255,255,255,0.15); border-radius: 16px;
      padding: 24px 20px; max-width: 90%; max-height: 80vh; overflow-y: auto;
      color: rgba(255,255,255,0.85); font-size: 13px; line-height: 1.6;
    }
    .privacy-modal h3 { color: #f0c040; font-size: 16px; margin: 0 0 16px; }
    .privacy-modal-close {
      display: block; width: 100%; margin-top: 20px; padding: 12px;
      background: #f0c040; color: #0d1f38; border: none; border-radius: 10px;
      font-size: 15px; font-weight: 700; cursor: pointer;
    }
    .consent-block { margin: 16px 0 8px; }
    .consent-label {
      display: flex; align-items: flex-start; gap: 10px;
      font-size: 13px; color: rgba(255,255,255,0.7); cursor: pointer; line-height: 1.5;
    }
    .consent-label input[type="checkbox"] {
      width: 18px; height: 18px; min-width: 18px; margin-top: 1px; cursor: pointer;
      accent-color: #f0c040;
    }
    .consent-link { color: #f0c040; text-decoration: underline; cursor: pointer; }
    .consent-note { font-size: 11px; color: rgba(255,255,255,0.35); margin: 6px 0 0 28px; }
    .apt-row { display: flex; gap: 8px; }
    .apt-row > div { flex: 1; position: relative; }
    .apt-row input.apt-input { width: 100px; flex-shrink: 0; }
  </style>

  <style>
    .lang-dropdown-wrap { position: relative; }
    .lang-dropdown-btn {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 6px 10px;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 20px;
      color: rgba(255,255,255,0.85);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
    .lang-dropdown-arrow { font-size: 10px; opacity: 0.6; }
    .lang-dropdown-menu {
      display: none;
      position: absolute;
      top: calc(100% + 6px);
      right: 0;
      background: #1a2b40;
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 12px;
      overflow: hidden;
      z-index: 999;
      min-width: 90px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    }
    .lang-dropdown-menu.lang-dropdown-open { display: block; }
    .lang-dropdown-menu button {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 10px 14px;
      background: transparent;
      border: none;
      color: rgba(255,255,255,0.85);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      text-align: left;
      box-sizing: border-box;
    }
    .lang-dropdown-menu button:active { background: rgba(255,255,255,0.08); }
  </style>
  <!-- TON Connect UI -->
  <script src="https://unpkg.com/@tonconnect/ui@latest/dist/tonconnect-ui.min.js"></script>
  <script src="https://unpkg.com/@tonconnect/ui@latest/dist/tonconnect-ui.min.js"></script>
  <style>
    .pay-btn-tonconnect {
      display: flex; align-items: center; gap: 12px;
      width: 100%; padding: 14px 18px;
      background: linear-gradient(135deg, #0088cc, #005fa3);
      border: none; border-radius: 14px; color: #fff;
      font-size: 15px; cursor: pointer; margin-bottom: 10px;
      text-decoration: none;
    }
    .pay-btn-tonconnect .pay-btn-icon { font-size: 22px; }
    .pay-btn-tonconnect .pay-btn-text { display: flex; flex-direction: column; align-items: flex-start; }
    .pay-btn-tonconnect strong { font-size: 15px; }
    .pay-btn-tonconnect small { font-size: 11px; opacity: 0.75; }
  </style>
  <!-- Telegram Mini Apps Analytics SDK -->
  <script src="https://tganalytics.xyz/index.js" defer></script>

  <script>
    window.addEventListener('load', function() {
      if (typeof telegramAnalytics !== 'undefined') {
        telegramAnalytics.init({
          token: 'eyJhcHBfbmFtZSI6Im9pbF9zb3VsIiwiYXBwX3VybCI6Imh0dHBzOi8vdC5tZS9PaWxTb3VsQm90IiwiYXBwX2RvbWFpbiI6Imh0dHBzOi8vb2lsc291bC5zaG9wIn0=!3fozeA3NMgnSAoJKbl3/xbgRSb5U+6v8fAe0z2I6yV8=',
          appName: 'oil_soul'
        });
      }
    });
  </script>
</head>
<body>

  <!-- Модальное окно политики конфиденциальности -->
  <div class="privacy-modal-overlay" id="privacy-modal-overlay" onclick="closePrivacyModal(event)">
    <div class="privacy-modal">
      <h3>Политика конфиденциальности</h3>
      <p>Oil&Soul — частный арт-проект, создающий физические картины маслом по мотивам коллекционных цифровых подарков.</p>
      <p>Мы обрабатываем персональные данные покупателей только для оформления заказа, связи с покупателем и организации доставки картины.</p>
      <p><strong>Какие данные мы собираем:</strong><br>
      — страна доставки;<br>— город;<br>— регион / область / штат, если указан;<br>
      — почтовый индекс;<br>— адрес доставки;<br>— имя и фамилия получателя;<br>
      — телефон;<br>— email;<br>— комментарий к заказу, если покупатель его оставляет.</p>
      <p><strong>Цели обработки данных:</strong><br>
      — оформление заказа;<br>— связь с покупателем;<br>— уточнение деталей заказа;<br>
      — организация доставки;<br>— поддержка покупателя по вопросам заказа.</p>
      <p>Мы не продаём персональные данные третьим лицам.</p>
      <p>Персональные данные могут передаваться только тем лицам и сервисам, которые участвуют в исполнении заказа: службам доставки, почтовым операторам, платёжным, техническим и иным подрядчикам, если это необходимо для оформления, оплаты, доставки или поддержки заказа.</p>
      <p>Мы не запрашиваем паспортные данные, дату рождения и другие избыточные сведения.</p>
      <p>Покупатель может запросить доступ к своим данным, исправление или удаление данных, написав нам по контактам, указанным в приложении.</p>
      <p>Для пользователей из разных стран могут действовать дополнительные права в соответствии с применимым законодательством о защите персональных данных.</p>
      <button class="privacy-modal-close" onclick="closePrivacyModal()">Понятно</button>
    </div>
  </div>

  <div id="page-catalog">
    <header class="main-header">
      <div class="main-header-left">
        <div class="main-header-logo">🎨</div>
        <div class="main-header-text">
          <div class="main-header-title">Oil&Soul</div>
          <div class="main-header-sub" id="header-sub">Картины маслом по мотивам Telegram-подарков</div>
        </div>
      </div>
      <div class="main-header-right">
        <div class="lang-dropdown-wrap">
          <button class="lang-dropdown-btn" id="lang-dropdown-btn" onclick="toggleLangDropdown()">
            <span id="lang-current-flag">🇷🇺</span>
            <span id="lang-current-code">RU</span>
            <span class="lang-dropdown-arrow">▾</span>
          </button>
          <div class="lang-dropdown-menu" id="lang-dropdown-menu">
            <button onclick="selectLang('ru')"><span>🇷🇺</span> RU</button>
            <button onclick="selectLang('en')"><span>🇬🇧</span> EN</button>
            <button onclick="selectLang('ar')"><span>🇸🇦</span> AR</button>
          </div>
        </div>
      </div>
    </header>

    <div class="hero-banner">
      <div class="hero-text">
        <h2 class="hero-title" id="hero-title">Цифровой подарок —<br>в настоящей<br>масляной живописи</h2>
        <p class="hero-desc" id="hero-desc">Мы переносим Telegram-подарки на холст 30×30 см: масляные краски, фактурные мазки, ручная работа и уникальный номер вашего подарка.</p>
      </div>
    </div>

    <div class="features-row">
      <div class="feature-card">
        <img src="icon_oil_canvas.png" class="feature-icon-img" alt="">
        <div class="feature-label" id="feat-1">Масло и холст</div>
      </div>
      <div class="feature-card">
        <img src="icon_world_shipping.png" class="feature-icon-img" alt="">
        <div class="feature-label" id="feat-2">Доставка по всему миру</div>
      </div>
      <div class="feature-card">
        <img src="icon_ton_payment.png" class="feature-icon-img" alt="">
        <div class="feature-label" id="feat-3">Оплата в TON</div>
      </div>
    </div>

    <main>
      <div id="catalog" class="catalog"></div>
    </main>

    <div class="bottom-bar">
      <button class="custom-bar-btn" id="custom-bar-btn" onclick="showCustomPage()">✍️ Под заказ</button>
      <div id="cart-bar" class="cart-bar hidden">
        <span id="cart-info"></span>
        <button id="checkout-btn">Оформить заказ →</button>
      </div>
    </div>

    <footer style="text-align:center;padding:20px 16px 32px;border-top:1px solid rgba(255,255,255,0.07);margin-top:8px;">
      <a href="https://www.instagram.com/oilsoul.art" target="_blank" rel="noopener"
         style="display:inline-flex;align-items:center;gap:8px;color:rgba(255,255,255,0.5);font-size:13px;text-decoration:none;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="1.8"/>
          <circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="1.8"/>
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
        </svg>
        @oilsoul.art
      </a>
    </footer>
  </div>

  <div id="page-detail" class="hidden"></div>

  <div id="page-checkout" class="hidden">
    <header>
      <button id="back-btn">← Назад</button>
      <h1>Оформление заказа</h1>
    </header>
    <div class="checkout-form">
      <div id="order-summary" class="order-summary"></div>
      <div class="form-section">
        <h3>📦 Данные для доставки</h3>
        <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:12px 14px;margin-bottom:12px;font-size:13px;color:rgba(255,255,255,0.55);line-height:1.6;border:1px solid rgba(255,255,255,0.08);">
          💡 Доставка рассчитывается индивидуально. После оформления заказа мы уточним стоимость и срок доставки в вашу страну или город. Картина будет надёжно упакована для безопасной пересылки.
        </div>
        <div style="position:relative;">
          <input type="text" id="field-country" placeholder="Страна *" autocomplete="off" required>
          <div id="country-dropdown" style="display:none;position:absolute;left:0;right:0;top:100%;background:#1e2d42;border:1px solid rgba(255,255,255,0.15);border-radius:10px;z-index:999;max-height:200px;overflow-y:auto;"></div>
        </div>
        <div style="position:relative;">
          <input type="text" id="field-city" placeholder="Город *" autocomplete="off" required>
          <div id="city-dropdown" style="display:none;position:absolute;left:0;right:0;top:100%;background:#1e2d42;border:1px solid rgba(255,255,255,0.15);border-radius:10px;z-index:999;max-height:200px;overflow-y:auto;"></div>
        </div>
        <div class="apt-row">
          <div>
            <input type="text" id="field-address" placeholder="Улица и номер дома *" autocomplete="off" required style="width:100%;">
            <div id="address-dropdown" style="display:none;position:absolute;left:0;right:0;top:100%;background:#1e2d42;border:1px solid rgba(255,255,255,0.15);border-radius:10px;z-index:999;max-height:200px;overflow-y:auto;"></div>
          </div>
          <input type="text" id="field-apt" placeholder="Кв./офис" autocomplete="off" class="apt-input">
        </div>
        <input type="text" id="field-postal" placeholder="Почтовый индекс *" autocomplete="postal-code" required>
        <input type="text" id="field-name" placeholder="Имя и фамилия *" autocomplete="name" required>
        <input type="tel" id="field-phone" placeholder="Телефон *" autocomplete="tel" required>
        <input type="email" id="field-email" placeholder="Email *" autocomplete="email" required>
        <textarea id="field-comment" placeholder="Комментарий к заказу (необязательно)" autocomplete="off"></textarea>

        <div class="consent-block">
          <label class="consent-label">
            <input type="checkbox" id="field-consent" onchange="updateSubmitBtn()">
            <span>Я согласен(на) на обработку моих персональных данных для оформления заказа, связи со мной и организации доставки. Я ознакомлен(а) с <span class="consent-link" onclick="openPrivacyModal(event)">Политикой конфиденциальности</span>.</span>
          </label>
          <div class="consent-note">Мы используем ваши данные только для оформления заказа, связи с вами и организации доставки картины.</div>
        </div>
      </div>
      <!-- ton-amount and ton-address-display kept as hidden anchors for JS compatibility -->
      <span id="ton-amount" style="display:none"></span>
      <span id="ton-address-display" style="display:none"></span>
      <button id="submit-btn" class="submit-btn" style="opacity:0.5;cursor:not-allowed;">✅ Подтвердить заказ</button>
    </div>
  </div>

  <script>
  function toggleLangDropdown() {
    var menu = document.getElementById('lang-dropdown-menu');
    menu.classList.toggle('lang-dropdown-open');
  }
  function selectLang(l) {
    var flags = { ru: '🇷🇺', en: '🇬🇧', ar: '🇸🇦' };
    document.getElementById('lang-current-flag').textContent = flags[l];
    document.getElementById('lang-current-code').textContent = l.toUpperCase();
    document.getElementById('lang-dropdown-menu').classList.remove('lang-dropdown-open');
    setLang(l);
  }
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.lang-dropdown-wrap')) {
      var menu = document.getElementById('lang-dropdown-menu');
      if (menu) menu.classList.remove('lang-dropdown-open');
    }
    ['country-dropdown','city-dropdown','address-dropdown'].forEach(function(id) {
      var fieldId = 'field-' + id.replace('-dropdown','');
      if (!e.target.closest('#' + fieldId) && !e.target.closest('#' + id)) {
        var dd = document.getElementById(id);
        if (dd) dd.style.display = 'none';
      }
    });
  });

  function openPrivacyModal(e) {
    if (e) e.stopPropagation();
    document.getElementById('privacy-modal-overlay').classList.add('active');
  }
  function closePrivacyModal(e) {
    if (e && e.target !== document.getElementById('privacy-modal-overlay')) return;
    document.getElementById('privacy-modal-overlay').classList.remove('active');
  }
  function updateSubmitBtn() {
    var btn = document.getElementById('submit-btn');
    var checked = document.getElementById('field-consent').checked;
    btn.style.opacity = checked ? '1' : '0.5';
    btn.style.cursor = checked ? 'pointer' : 'not-allowed';
  }
  </script>
  <script src="products.js"></script>
  <script src="app.js"></script>
  <script>
    var acTimer = null;
    var DD_STYLE = 'padding:10px 14px;cursor:pointer;font-size:13px;color:rgba(255,255,255,0.85);border-bottom:1px solid rgba(255,255,255,0.07);';

    function nominatimSearch(query, callback) {
      fetch('https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(query) + '&format=json&addressdetails=1&limit=5&accept-language=ru')
        .then(function(r) { return r.json(); })
        .then(callback)
        .catch(function() { callback([]); });
    }

    function showDropdown(dropdownId, items, onSelect) {
      var dd = document.getElementById(dropdownId);
      dd.innerHTML = '';
      if (!items.length) { dd.style.display = 'none'; return; }
      items.forEach(function(item) {
        var div = document.createElement('div');
        div.style.cssText = DD_STYLE;
        div.textContent = item.label;
        div.addEventListener('mousedown', function(e) {
          e.preventDefault();
          onSelect(item);
          dd.style.display = 'none';
        });
        dd.appendChild(div);
      });
      dd.style.display = 'block';
    }

    // Страна
    document.getElementById('field-country').addEventListener('input', function() {
      var val = this.value.trim();
      clearTimeout(acTimer);
      if (val.length < 2) { document.getElementById('country-dropdown').style.display = 'none'; return; }
      acTimer = setTimeout(function() {
        nominatimSearch(val, function(results) {
          var seen = {}, items = [];
          results.forEach(function(r) {
            var c = r.address && r.address.country;
            if (c && !seen[c]) { seen[c] = true; items.push({ label: c, data: r }); }
          });
          showDropdown('country-dropdown', items, function(item) {
            document.getElementById('field-country').value = item.label;
          });
        });
      }, 400);
    });

    // Город
    document.getElementById('field-city').addEventListener('input', function() {
      var val = this.value.trim();
      clearTimeout(acTimer);
      if (val.length < 2) { document.getElementById('city-dropdown').style.display = 'none'; return; }
      var country = document.getElementById('field-country').value.trim();
      acTimer = setTimeout(function() {
        nominatimSearch(val + (country ? ', ' + country : ''), function(results) {
          var seen = {}, items = [];
          results.forEach(function(r) {
            var addr = r.address || {};
            var city = addr.city || addr.town || addr.village;
            if (city && !seen[city]) { seen[city] = true; items.push({ label: city, data: r }); }
          });
          showDropdown('city-dropdown', items, function(item) {
            var addr = item.data.address || {};
            document.getElementById('field-city').value = item.label;
            if (addr.country) document.getElementById('field-country').value = addr.country;
            if (addr.postcode) document.getElementById('field-postal').value = addr.postcode;
          });
        });
      }, 400);
    });

    // Адрес
    document.getElementById('field-address').addEventListener('input', function() {
      var val = this.value.trim();
      clearTimeout(acTimer);
      if (val.length < 3) { document.getElementById('address-dropdown').style.display = 'none'; return; }
      var city = document.getElementById('field-city').value.trim();
      var country = document.getElementById('field-country').value.trim();
      acTimer = setTimeout(function() {
        nominatimSearch(val + (city ? ', ' + city : '') + (country ? ', ' + country : ''), function(results) {
          var items = results.map(function(r) { return { label: r.display_name, data: r }; });
          showDropdown('address-dropdown', items, function(item) {
            var addr = item.data.address || {};
            document.getElementById('field-address').value = (addr.road || '') + (addr.house_number ? ', ' + addr.house_number : '');
            if (addr.city || addr.town || addr.village)
              document.getElementById('field-city').value = addr.city || addr.town || addr.village;
            if (addr.country) document.getElementById('field-country').value = addr.country;
            if (addr.postcode) document.getElementById('field-postal').value = addr.postcode;
          });
        });
      }, 500);
    });

    // Кастомная форма
    function initCustomAutocomplete() {
      var addressEl = document.getElementById('custom-address');
      if (!addressEl) return;
      var wrap = addressEl.parentNode;
      wrap.style.position = 'relative';
      var dropdown = document.createElement('div');
      dropdown.style.cssText = 'display:none;position:absolute;left:0;right:0;top:100%;background:#1e2d42;border:1px solid rgba(255,255,255,0.15);border-radius:10px;z-index:999;max-height:200px;overflow-y:auto;';
      wrap.appendChild(dropdown);
      addressEl.addEventListener('input', function() {
        var val = this.value.trim();
        clearTimeout(acTimer);
        if (val.length < 3) { dropdown.style.display = 'none'; return; }
        var city = (document.getElementById('custom-city') || {value:''}).value.trim();
        var country = (document.getElementById('custom-country') || {value:''}).value.trim();
        acTimer = setTimeout(function() {
          nominatimSearch(val + (city ? ', ' + city : '') + (country ? ', ' + country : ''), function(results) {
            dropdown.innerHTML = '';
            if (!results.length) { dropdown.style.display = 'none'; return; }
            results.forEach(function(item) {
              var div = document.createElement('div');
              div.style.cssText = DD_STYLE;
              div.textContent = item.display_name;
              div.addEventListener('mousedown', function(e) {
                e.preventDefault();
                var addr = item.address || {};
                addressEl.value = (addr.road || '') + (addr.house_number ? ', ' + addr.house_number : '');
                var cityEl = document.getElementById('custom-city');
                var countryEl = document.getElementById('custom-country');
                var postalEl = document.getElementById('custom-postal');
                if (cityEl && (addr.city || addr.town)) cityEl.value = addr.city || addr.town;
                if (countryEl && addr.country) countryEl.value = addr.country;
                if (postalEl && addr.postcode) postalEl.value = addr.postcode;
                dropdown.style.display = 'none';
              });
              dropdown.appendChild(div);
            });
            dropdown.style.display = 'block';
          });
        }, 500);
      });
    }
  </script>
</body>
</html>

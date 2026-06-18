import os
import json
import threading
import time
from flask import Flask, request
from flask_cors import CORS
import requests
import psycopg2
from psycopg2.extras import RealDictCursor

TOKEN = os.environ.get('BOT_TOKEN')
ADMIN_ID = 364102600
WEBHOOK_URL = os.environ.get('WEBHOOK_URL')
DATABASE_URL = os.environ.get('DATABASE_URL')
TON_WALLET = 'UQB1gcgRoxQ88K6uEHr31G6j4F9_29olrnAXCozRp029Xzom'
TON_API_KEY = 'e7ea536bf5ab4a139c669310f6d77c8513e7151feab6ef0686a3a7d2a1636d51'

# USDT jetton master address on TON mainnet

app = Flask(__name__)
CORS(app)

def get_db():
    return psycopg2.connect(DATABASE_URL, sslmode='require')

def init_db():
    for attempt in range(5):
        try:
            print(f'DB init attempt {attempt+1}...')
            conn = get_db()
            cur = conn.cursor()
            cur.execute('''
                CREATE TABLE IF NOT EXISTS pending_orders (
                    order_id TEXT PRIMARY KEY,
                    chat_id BIGINT,
                    total_ton FLOAT,
                    user_name TEXT,
                                    created_at TIMESTAMP DEFAULT NOW()
                )
            ''')
            cur.execute('''
                CREATE TABLE IF NOT EXISTS confirmed_orders (
                    order_id TEXT PRIMARY KEY,
                    confirmed_at TIMESTAMP DEFAULT NOW()
                )
            ''')
            conn.commit()
            cur.close()
            conn.close()
            print('DB initialized OK')
            return
        except Exception as e:
            import traceback
            print(f'DB init error (attempt {attempt+1}): {e}')
            traceback.print_exc()
            time.sleep(3)
    print('DB init FAILED after 5 attempts')

def save_order(order_id, chat_id, total_ton, user_name):
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            'INSERT INTO pending_orders (order_id, chat_id, total_ton, user_name) VALUES (%s, %s, %s, %s) ON CONFLICT (order_id) DO NOTHING',
            (order_id, chat_id, total_ton, user_name)
        )
        conn.commit()
        cur.close()
        conn.close()
        print(f'Order saved to DB: {order_id} currency={currency}')
    except Exception as e:
        print(f'save_order error: {e}')

def get_pending_order(order_id):
    try:
        conn = get_db()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute('SELECT * FROM pending_orders WHERE order_id = %s', (order_id,))
        row = cur.fetchone()
        cur.close()
        conn.close()
        return dict(row) if row else None
    except Exception as e:
        print(f'get_pending_order error: {e}')
        return None

def is_confirmed(order_id):
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute('SELECT 1 FROM confirmed_orders WHERE order_id = %s', (order_id,))
        result = cur.fetchone()
        cur.close()
        conn.close()
        return result is not None
    except Exception as e:
        print(f'is_confirmed error: {e}')
        return False

def confirm_order(order_id):
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            'INSERT INTO confirmed_orders (order_id) VALUES (%s) ON CONFLICT DO NOTHING',
            (order_id,)
        )
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print(f'confirm_order error: {e}')

def send_message(chat_id, text):
    url = f'https://api.telegram.org/bot{TOKEN}/sendMessage'
    requests.post(url, json={'chat_id': chat_id, 'text': text, 'parse_mode': 'HTML'})

_webhook_set = False
def set_webhook_once():
    global _webhook_set
    if _webhook_set:
        return
    _webhook_set = True
    url = f'https://api.telegram.org/bot{TOKEN}/setWebhook'
    r = requests.post(url, json={'url': WEBHOOK_URL})
    print('Webhook set:', r.json())

# ─── GRAM monitor ───────────────────────────────────────────────────────────

def check_ton_transactions():
    last_lt = None
    first_run = True
    while True:
        try:
            params = {
                'address': TON_WALLET,
                'limit': 20,
                'api_key': TON_API_KEY
            }
            r = requests.get('https://toncenter.com/api/v2/getTransactions', params=params, timeout=10)
            data = r.json()

            if data.get('ok') and data.get('result'):
                for tx in data['result']:
                    tx_lt = tx.get('transaction_id', {}).get('lt', '')
                    if tx_lt == last_lt:
                        break
                    if last_lt is None and not first_run:
                        last_lt = tx_lt
                        break

                    msg = tx.get('in_msg', {})
                    amount = int(msg.get('value', 0))
                    comment = msg.get('message', '').strip()
                    if comment:
                        print(f'GRAM TX comment: {comment}')

                    print(f'GRAM TX: comment={comment}, amount={amount}')

                    if comment.startswith('OS-') and not is_confirmed(comment):
                        order = get_pending_order(comment)
                        if order and order.get('currency', 'gram') == 'gram':
                            expected_nano = int(order['total_ton'] * 1e9)
                            if amount >= expected_nano * 0.99:
                                confirm_order(comment)
                                chat_id = order.get('chat_id')
                                if chat_id:
                                    send_message(chat_id,
                                        f'✅ <b>Оплата по заказу {comment} получена!</b>\n\n'
                                        f'💎 {order["total_ton"]} GRAM — подтверждено\n\n'
                                        '🖼 Мы приступаем к работе.\n'
                                        'Срок изготовления: 21 день.\n\n'
                                        'Мы свяжемся с вами когда картина будет готова к отправке.'
                                    )
                                send_message(ADMIN_ID,
                                    f'💰 <b>ОПЛАТА ПОЛУЧЕНА! (GRAM)</b>\n\n'
                                    f'👤 {order.get("user_name", "—")}\n'
                                    f'🆔 ID: {chat_id}\n'
                                    f'💎 {order["total_ton"]} GRAM\n'
                                    f'🔑 Заказ: {comment}'
                                )
                                print(f'GRAM order confirmed: {comment}')

                    if last_lt is None or int(tx_lt) > int(last_lt):
                        last_lt = tx_lt

        except Exception as e:
            print(f'GRAM monitor error: {e}')

        first_run = False
        time.sleep(30)

def _start_monitor_once():
    if not any(t.name == 'ton_monitor' for t in threading.enumerate()):
        t = threading.Thread(target=check_ton_transactions, daemon=True, name='ton_monitor')
        t.start()
        print('GRAM monitor started')


@app.route('/')
def index():
    set_webhook_once()
    return 'Oil&Soul Bot is running'

@app.route('/webhook', methods=['POST'])
def webhook():
    data = request.json
    if not data or 'message' not in data:
        return 'ok'
    msg = data['message']
    chat_id = msg['chat']['id']
    text = msg.get('text', '').strip()
    if text.startswith('/start'):
        send_message(chat_id,
            '🎨 <b>Добро пожаловать в Oil&Soul!</b>\n\n'
            'Уникальные картины маслом в стиле Telegram-подарков.\n\n'
            'Откройте магазин кнопкой ниже.'
        )
    elif text.startswith('/pay') and chat_id == ADMIN_ID:
        # Format: /pay OS-XXXX
        parts = text.strip().split()
        if len(parts) < 2:
            send_message(chat_id, '❌ Формат: /pay OS-XXXX')
        else:
            order_id = parts[1].upper()
            order = get_pending_order(order_id)
            if not order:
                send_message(chat_id, f'❌ Заказ {order_id} не найден в базе.')
            elif is_confirmed(order_id):
                send_message(chat_id, f'✅ Заказ {order_id} уже оплачен.')
            else:
                client_chat_id = order.get('chat_id')
                total_ton = order.get('total_ton', 99)
                if client_chat_id:
                    send_message(client_chat_id,
                        f'💎 <b>Реквизиты для оплаты заказа {order_id}</b>\n\n'
                        f'Адрес кошелька:\n<code>{TON_WALLET}</code>\n\n'
                        f'Сумма: <b>{total_ton} GRAM</b>\n'
                        f'Комментарий: <code>{order_id}</code>\n\n'
                        '⚠️ Обязательно укажите номер заказа в комментарии к переводу — оплата подтвердится автоматически.\n\n'
                        'После получения оплаты мы приступим к написанию картины. Срок изготовления — 21 день.'
                    )
                    send_message(chat_id, f'✅ Реквизиты отправлены клиенту (ID: {client_chat_id}).')
                else:
                    send_message(chat_id, f'❌ Не удалось найти Telegram ID клиента для заказа {order_id}.')
    elif text.startswith('/pay'):
        pass  # ignore /pay from non-admins silently
    else:
        send_message(chat_id, '🎨 Откройте магазин Oil&Soul чтобы сделать заказ.')
    return 'ok'

@app.route('/order', methods=['POST', 'OPTIONS'])
def order():
    if request.method == 'OPTIONS':
        return '', 204
    data = request.json
    if not data:
        return {'ok': False}

    chat_id = data.get('chat_id')
    user_name = data.get('user_name', 'Неизвестен')
    items = data.get('items', [])
    total_ton = data.get('total_ton', sum(i.get('ton', 0) for i in items))
    delivery = data.get('delivery', {})
    order_id = data.get('order_id') or ('OS-' + str(int(time.time())))
    currency = data.get('currency', 'gram')  # 'gram' or 'usdt'

    save_order(order_id, chat_id, total_ton, user_name)

    currency_symbol = 'USDT' if currency == 'usdt' else 'GRAM'

    if chat_id:
        order_text = f'✅ <b>Заказ {order_id} принят!</b>\n\n'
        for item in items:
            order_text += f'🎨 {item["title"]} — {item.get("ton", 0)} {currency_symbol}\n'
        order_text += (
            f'\n💎 Итого: <b>{total_ton} {currency_symbol}</b>\n\n'
            f'💳 Оплата:\n'
            f'Адрес: <code>{TON_WALLET}</code>\n'
            f'Сумма: <b>{total_ton} {currency_symbol}</b>\n'
            f'Комментарий: <code>{order_id}</code>\n\n'
            f'Переведите точную сумму с комментарием — оплата подтвердится автоматически.'
        )
        send_message(chat_id, order_text)

    is_anon = delivery.get('anonymous', False)
    comment_field = delivery.get('comment', '')
    tg_contact = ''
    if is_anon and comment_field.startswith('Telegram:'):
        tg_contact = comment_field.split('|')[0].replace('Telegram:', '').strip()

    if is_anon:
        # Auto-send template message to client
        if chat_id:
            items_text = ', '.join([item['title'] for item in items])
            client_msg = (
                f'Приветствуем! Рады, что Вас заинтересовала картина 🎨\n\n'
                f'Вы выбрали формат доставки с согласованием в Telegram. Домашний адрес заранее указывать не нужно.\n\n'
                f'Ваш город ({delivery.get("city", "—")}) уже указан в заявке. Для получения картины мы можем рассмотреть доставку через постамат или пункт выдачи СДЭК, если подходящий вариант доступен в Вашем городе.\n\n'
                '<b>Как это работает:</b>\n'
                '1. Вы выбираете удобный постамат или пункт выдачи СДЭК\n'
                '2. Присылаете нам его адрес или код/название пункта\n'
                '3. Мы проверяем возможность отправки картины в выбранный пункт\n'
                '4. После подтверждения отправим точную стоимость доставки и данные для оплаты\n'
                '5. Мы напишем картину (срок — 21 день) и отправим через СДЭК\n'
                '6. Когда посылка прибудет в пункт выдачи — пришлём Вам трек-номер и код получения\n\n'
                '⚠️ Обратите внимание: срок хранения в постамате или пункте выдачи ограничен. Пожалуйста, заберите посылку вовремя, чтобы избежать возврата и повторных расходов на доставку.\n\n'
                'Пришлите, пожалуйста, адрес или код удобного пункта СДЭК 👇\n'
                'Найти пункт выдачи: https://www.cdek.ru/ru/offices/'
            )
            send_message(chat_id, client_msg)

        admin_text = (
            '📦 <b>АНОНИМНЫЙ ЗАКАЗ — НУЖНО СОГЛАСОВАТЬ ДОСТАВКУ!</b>\n\n'
            f'🔑 Заказ: {order_id}\n'
            f'🆔 Telegram ID: {chat_id}\n'
            f'💬 Telegram: {tg_contact or "—"}\n\n'
            '<b>Товары:</b>\n'
        )
        for item in items:
            admin_text += f'🎨 {item["title"]} — {item.get("ton", 0)} GRAM\n'
        admin_text += (
            f'\n📍 Страна: {delivery.get("deliveryCountry", "—")}\n'
            f'📍 Город: {delivery.get("city", "—")}\n\n'
            '✅ Шаблон с инструкцией уже отправлен клиенту автоматически.\n'
            '⚠️ Дождитесь когда клиент пришлёт код ПВЗ, затем пришлите реквизиты для оплаты.'
        )
    else:
        admin_text = (
            '🛍 <b>НОВЫЙ ЗАКАЗ!</b>\n\n'
            f'👤 {user_name}\n'
            f'🆔 ID: {chat_id}\n'
            f'🔑 Заказ: {order_id}\n\n'
            '<b>Товары:</b>\n'
        )
        for item in items:
            admin_text += f'🎨 {item["title"]} — {item.get("ton", 0)} GRAM\n'
        admin_text += (
            f'\n💎 <b>Итого: {total_ton} GRAM</b>\n\n'
            f'📦 <b>Доставка:</b>\n'
            f'Имя: {delivery.get("recipientName", delivery.get("name", "—"))}\n'
            f'Страна: {delivery.get("deliveryCountry", delivery.get("country", "—"))}\n'
            f'Город: {delivery.get("city", "—")}\n'
            f'Адрес: {delivery.get("address", "—")}\n'
            f'Индекс: {delivery.get("postalCode", delivery.get("postal", "—"))}\n'
            f'Телефон: {delivery.get("recipientPhone", delivery.get("phone", "—"))}\n'
            f'Email: {delivery.get("recipientEmail", delivery.get("email", "—"))}\n'
        )
        if delivery.get('comment'):
            admin_text += f'Комментарий: {delivery.get("comment")}\n'
    send_message(ADMIN_ID, admin_text)
    return {'ok': True}

@app.route('/custom_order', methods=['POST', 'OPTIONS'])
def custom_order():
    if request.method == 'OPTIONS':
        return '', 204
    data = request.json
    if not data:
        return {'ok': False}

    chat_id = data.get('chat_id')
    user_name = data.get('user_name', 'Неизвестен')
    gift_link = data.get('gift_link', '—')
    delivery = data.get('delivery', {})
    order_id = data.get('order_id', 'OS-' + str(int(time.time())))

    save_order(order_id, chat_id, 149, user_name)

    if chat_id:
        send_message(chat_id,
            f'✅ <b>Заказ {order_id} принят!</b>\n\n'
            f'🔗 Подарок: {gift_link}\n'
            f'🖼 Размер: 30×30 см, масло на холсте\n'
            f'🔢 Уникальный номер на картине\n'
            f'💎 Стоимость: <b>149 GRAM</b>\n'
            f'⏱ Срок изготовления: 21 день + доставка\n\n'
            f'💳 Оплата:\n'
            f'Адрес: <code>{TON_WALLET}</code>\n'
            f'Сумма: <b>149 GRAM</b>\n'
            f'Комментарий: <code>{order_id}</code>\n\n'
            f'Переведите точную сумму с комментарием — оплата подтвердится автоматически. 🎨'
        )

    admin_text = (
        '🖌 <b>НОВЫЙ КАСТОМНЫЙ ЗАКАЗ!</b>\n\n'
        f'👤 {user_name}\n'
        f'🆔 ID: {chat_id}\n'
        f'🔑 Заказ: {order_id}\n\n'
        f'🔗 <b>Подарок:</b> {gift_link}\n\n'
        f'🖼 30×30 см · 149 GRAM\n\n'
        f'📦 <b>Доставка:</b>\n'
        f'Имя: {delivery.get("recipientName", delivery.get("name", "—"))}\n'
        f'Страна: {delivery.get("deliveryCountry", delivery.get("country", "—"))}\n'
        f'Город: {delivery.get("city", "—")}\n'
        f'Адрес: {delivery.get("address", "—")}\n'
        f'Индекс: {delivery.get("postalCode", delivery.get("postal", "—"))}\n'
        f'Телефон: {delivery.get("recipientPhone", delivery.get("phone", "—"))}\n'
        f'Email: {delivery.get("recipientEmail", delivery.get("email", "—"))}\n'
    )
    if delivery.get('comment'):
        admin_text += f'Комментарий: {delivery.get("comment")}\n'
    send_message(ADMIN_ID, admin_text)
    return {'ok': True}



@app.route('/track', methods=['POST', 'OPTIONS'])
def track_event():
    if request.method == 'OPTIONS':
        return '', 204
    data = request.json
    if not data:
        return {'ok': False}
    try:
        event_data = {
            'user_id': str(data.get('user_id', 'anonymous')),
            'event_type': data.get('event', 'unknown'),
            'event_properties': data.get('props', {}),
            'time': int(data.get('time', time.time() * 1000)),
            'platform': 'Web',
            'insert_id': str(data.get('user_id', 'anon')) + '_' + str(int(time.time() * 1000))
        }
        payload = {
            'api_key': '16ca19e366e3c0934b941de8fc7c87b',
            'events': [event_data]
        }
        r = requests.post(
            'https://api2.eu.amplitude.com/2/httpapi',
            json=payload,
            headers={'Content-Type': 'application/json'},
            timeout=5
        )
        print(f"Amplitude track: {data.get('event')} -> {r.status_code} | {r.text[:200]}")
        return {'ok': True}
    except Exception as e:
        print(f'track_event error: {e}')
        return {'ok': False}

# Инициализация БД и запуск мониторинга при старте
init_db()
_start_monitor_once()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)

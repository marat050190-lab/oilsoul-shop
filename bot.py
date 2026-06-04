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
TON_WALLET = 'UQCbHnRC6iUeksoheBxy2Xo_Lh0qGkr98J10nUCzHsG8KLq_'
TON_API_KEY = 'e7ea536bf5ab4a139c669310f6d77c8513e7151feab6ef0686a3a7d2a1636d51'

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
        print(f'Order saved to DB: {order_id}')
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
                    comment_hex = msg.get('message', '')
                    amount = int(msg.get('value', 0))

                    try:
                        comment = bytes.fromhex(comment_hex).decode('utf-8').strip()
                    except:
                        comment = ''

                    print(f'TX: comment={comment}, amount={amount}')

                    if comment.startswith('OS-') and not is_confirmed(comment):
                        order = get_pending_order(comment)
                        if order:
                            expected_nano = int(order['total_ton'] * 1e9)
                            if amount >= expected_nano * 0.99:
                                confirm_order(comment)
                                chat_id = order.get('chat_id')
                                if chat_id:
                                    send_message(chat_id,
                                        '✅ <b>Оплата получена!</b>\n\n'
                                        f'💎 {order["total_ton"]} TON — подтверждено\n\n'
                                        '🎨 Художник приступает к работе.\n'
                                        'Срок изготовления: 21 день.\n\n'
                                        'Мы свяжемся с вами когда картина будет готова к отправке.'
                                    )
                                send_message(ADMIN_ID,
                                    f'💰 <b>ОПЛАТА ПОЛУЧЕНА!</b>\n\n'
                                    f'👤 {order.get("user_name", "—")}\n'
                                    f'🆔 ID: {chat_id}\n'
                                    f'💎 {order["total_ton"]} TON\n'
                                    f'🔑 Заказ: {comment}'
                                )
                                print(f'Order confirmed: {comment}')

                    if last_lt is None or int(tx_lt) > int(last_lt):
                        last_lt = tx_lt

        except Exception as e:
            print(f'TON monitor error: {e}')

        first_run = False
        time.sleep(30)

def _start_monitor_once():
    if not any(t.name == 'ton_monitor' for t in threading.enumerate()):
        t = threading.Thread(target=check_ton_transactions, daemon=True, name='ton_monitor')
        t.start()
        print('TON monitor started')

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

    save_order(order_id, chat_id, total_ton, user_name)

    if chat_id:
        order_text = '✅ <b>Ваш заказ принят!</b>\n\n'
        for item in items:
            order_text += f'🎨 {item["title"]} — {item.get("ton", 0)} TON\n'
        order_text += (
            f'\n💎 Итого: <b>{total_ton} TON</b>\n\n'
            f'💳 Переведите <b>{total_ton} TON</b> на адрес:\n'
            f'<code>{TON_WALLET}</code>\n\n'
            f'📝 В комментарии к переводу укажите:\n'
            f'<code>{order_id}</code>\n\n'
            f'После перевода оплата подтвердится автоматически.'
        )
        send_message(chat_id, order_text)

    admin_text = (
        '🛍 <b>НОВЫЙ ЗАКАЗ!</b>\n\n'
        f'👤 {user_name}\n'
        f'🆔 ID: {chat_id}\n'
        f'🔑 Заказ: {order_id}\n\n'
        '<b>Товары:</b>\n'
    )
    for item in items:
        admin_text += f'🎨 {item["title"]} — {item.get("ton", 0)} TON\n'
    admin_text += (
        f'\n💎 <b>Итого: {total_ton} TON</b>\n\n'
        f'📦 <b>Доставка:</b>\n'
        f'Имя: {delivery.get("name", "—")}\n'
        f'Страна: {delivery.get("country", "—")}\n'
        f'Город: {delivery.get("city", "—")}\n'
        f'Адрес: {delivery.get("address", "—")}\n'
        f'Индекс: {delivery.get("postal", "—")}\n'
        f'Телефон: {delivery.get("phone", "—")}\n'
        f'Email: {delivery.get("email", "—")}\n'
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
            '✅ <b>Заказ картины принят!</b>\n\n'
            f'🔗 Подарок: {gift_link}\n'
            f'🖼 Размер: 30×30 см, масло на холсте\n'
            f'🔢 Уникальный NFT-номер на картине\n'
            f'💎 Стоимость: <b>149 TON</b>\n'
            f'⏱ Срок: 21 день + доставка\n\n'
            f'💳 Переведите <b>149 TON</b> на адрес:\n'
            f'<code>{TON_WALLET}</code>\n\n'
            f'📝 В комментарии к переводу укажите:\n'
            f'<code>{order_id}</code>\n\n'
            f'После перевода оплата подтвердится автоматически. 🎨'
        )

    admin_text = (
        '🖌 <b>НОВЫЙ КАСТОМНЫЙ ЗАКАЗ!</b>\n\n'
        f'👤 {user_name}\n'
        f'🆔 ID: {chat_id}\n'
        f'🔑 Заказ: {order_id}\n\n'
        f'🔗 <b>Подарок:</b> {gift_link}\n\n'
        f'🖼 30×30 см · 149 TON\n\n'
        f'📦 <b>Доставка:</b>\n'
        f'Имя: {delivery.get("name", "—")}\n'
        f'Страна: {delivery.get("country", "—")}\n'
        f'Город: {delivery.get("city", "—")}\n'
        f'Адрес: {delivery.get("address", "—")}\n'
        f'Индекс: {delivery.get("postal", "—")}\n'
        f'Телефон: {delivery.get("phone", "—")}\n'
        f'Email: {delivery.get("email", "—")}\n'
    )
    if delivery.get('comment'):
        admin_text += f'Комментарий: {delivery.get("comment")}\n'
    send_message(ADMIN_ID, admin_text)
    return {'ok': True}

# Инициализация БД и запуск мониторинга при старте
init_db()
_start_monitor_once()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)

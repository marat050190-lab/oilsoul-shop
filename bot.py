import os
import json
import threading
import time
from flask import Flask, request
from flask_cors import CORS
import requests

TOKEN = os.environ.get('BOT_TOKEN')
ADMIN_ID = 364102600
WEBHOOK_URL = os.environ.get('WEBHOOK_URL')
TON_WALLET = 'UQCbHnRC6iUeksoheBxy2Xo_Lh0qGkr98J10nUCzHsG8KLq_'
TON_API_KEY = 'e7ea536bf5ab4a139c669310f6d77c8513e7151feab6ef0686a3a7d2a1636d51'

app = Flask(__name__)
CORS(app)

# Хранилище ожидающих заказов: { 'OS-XXXXXX': { chat_id, total_ton, user_name } }
pending_orders = {}
confirmed_orders = set()

def send_message(chat_id, text):
    url = f'https://api.telegram.org/bot{TOKEN}/sendMessage'
    requests.post(url, json={'chat_id': chat_id, 'text': text, 'parse_mode': 'HTML'})

def set_webhook():
    url = f'https://api.telegram.org/bot{TOKEN}/setWebhook'
    r = requests.post(url, json={'url': WEBHOOK_URL})
    print('Webhook set:', r.json())

def check_ton_transactions():
    last_lt = None
    while True:
        try:
            url = f'https://toncenter.com/api/v2/getTransactions'
            params = {
                'address': TON_WALLET,
                'limit': 20,
                'api_key': TON_API_KEY
            }
            r = requests.get(url, params=params, timeout=10)
            data = r.json()

            if data.get('ok') and data.get('result'):
                for tx in data['result']:
                    tx_lt = tx.get('transaction_id', {}).get('lt', '')
                    if tx_lt == last_lt:
                        break

                    if last_lt is None:
                        last_lt = tx_lt
                        break

                    msg = tx.get('in_msg', {})
                    comment_hex = msg.get('message', '')
                    amount = int(msg.get('value', 0))

                    try:
                        comment = bytes.fromhex(comment_hex).decode('utf-8').strip()
                    except:
                        comment = ''

                    if comment.startswith('OS-') and comment in pending_orders and comment not in confirmed_orders:
                        order = pending_orders[comment]
                        expected_nano = int(order['total_ton'] * 1e9)

                        if amount >= expected_nano * 0.99:
                            confirmed_orders.add(comment)
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

                    if last_lt is None or int(tx_lt) > int(last_lt):
                        last_lt = tx_lt

        except Exception as e:
            print(f'TON monitor error: {e}')

        time.sleep(30)

def start_ton_monitor():
    t = threading.Thread(target=check_ton_transactions, daemon=True)
    t.start()

@app.route('/')
def index():
    set_webhook()
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
        send_message(chat_id,
            '🎨 Откройте магазин Oil&Soul чтобы сделать заказ.'
        )
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

    if order_id and chat_id:
        pending_orders[order_id] = {
            'chat_id': chat_id,
            'total_ton': total_ton,
            'user_name': user_name
        }

    if chat_id:
        order_text = (
            '✅ <b>Ваш заказ принят!</b>\n\n'
        )
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

    if chat_id:
        pending_orders[order_id] = {
            'chat_id': chat_id,
            'total_ton': 149,
            'user_name': user_name
        }
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

if __name__ == '__main__':
    start_ton_monitor()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)

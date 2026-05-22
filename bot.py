import os
import json
from flask import Flask, request
from flask_cors import CORS
import requests

TOKEN = os.environ.get('BOT_TOKEN')
ADMIN_ID = 364102600
WEBHOOK_URL = os.environ.get('WEBHOOK_URL')
TON_WALLET = 'UQCbHnRC6iUeksoheBxy2Xo_Lh0qGkr98J10nUCzHsG8KLq_'

app = Flask(__name__)
CORS(app)

def send_message(chat_id, text):
    url = f'https://api.telegram.org/bot{TOKEN}/sendMessage'
    requests.post(url, json={'chat_id': chat_id, 'text': text, 'parse_mode': 'HTML'})

def set_webhook():
    url = f'https://api.telegram.org/bot{TOKEN}/setWebhook'
    r = requests.post(url, json={'url': WEBHOOK_URL})
    print('Webhook set:', r.json())

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

    if chat_id:
        order_text = '✅ <b>Ваш заказ принят!</b>\n\n'
        for item in items:
            order_text += f'🎨 {item["title"]} — {item.get("ton", 0)} TON\n'
        order_text += (
            f'\n💎 Итого: {total_ton} TON\n\n'
            f'Переведите <b>{total_ton} TON</b> на адрес:\n'
            f'<code>{TON_WALLET}</code>\n\n'
            f'После оплаты пришлите скриншот транзакции сюда.'
        )
        send_message(chat_id, order_text)

    admin_text = (
        '🛍 <b>НОВЫЙ ЗАКАЗ!</b>\n\n'
        f'👤 {user_name}\n'
        f'🆔 ID: {chat_id}\n\n'
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

    if chat_id:
        send_message(chat_id,
            '✅ <b>Заказ картины принят!</b>\n\n'
            f'🔗 Подарок: {gift_link}\n'
            f'🖼 Размер: 30×30 см, масло на холсте\n'
            f'🔢 На картине будет уникальный NFT-номер\n'
            f'💎 Стоимость: <b>149 TON</b>\n'
            f'⏱ Срок: 21 день + доставка\n\n'
            f'💳 Переведите <b>149 TON</b> на адрес:\n'
            f'<code>{TON_WALLET}</code>\n\n'
            f'После оплаты пришлите скриншот транзакции сюда. 🎨'
        )

    admin_text = (
        '🖌 <b>НОВЫЙ КАСТОМНЫЙ ЗАКАЗ!</b>\n\n'
        f'👤 {user_name}\n'
        f'🆔 ID: {chat_id}\n\n'
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
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)

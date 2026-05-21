import os
import json
from flask import Flask, request
from flask_cors import CORS
import requests

TOKEN = os.environ.get('BOT_TOKEN')
ADMIN_ID = 364102600
WEBHOOK_URL = os.environ.get('WEBHOOK_URL')

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
    if not data:
        return 'ok'

    if 'message' in data:
        msg = data['message']
        chat_id = msg['chat']['id']
        text = msg.get('text', '')

        if text == '/start':
            send_message(chat_id,
                '🎨 <b>Добро пожаловать в Oil&Soul!</b>\n\n'
                'Здесь вы можете купить уникальные картины маслом '
                'в стиле Telegram-подарков.\n\n'
                'Нажмите кнопку <b>🎨 Магазин</b> внизу чтобы открыть каталог.')

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
        order_text += f'\n💎 Итого: {total_ton} TON\n\n'
        order_text += f'Переведите <b>{total_ton} TON</b> на адрес:\n'
        order_text += f'<code>UQCbHnRC6iUeksoheBxy2Xo_Lh0qGkr98J10nUCzHsG8KLq_</code>\n\n'
        order_text += 'После оплаты пришлите скриншот транзакции сюда.'
        send_message(chat_id, order_text)

    admin_text = '🛍 <b>НОВЫЙ ЗАКАЗ!</b>\n\n'
    admin_text += f'👤 <b>Покупатель:</b> {user_name}\n'
    admin_text += f'🆔 ID: {chat_id}\n\n'
    admin_text += '<b>Товары:</b>\n'
    for item in items:
        admin_text += f'🎨 {item["title"]} — {item.get("ton", 0)} TON\n'
    admin_text += f'\n💎 <b>Итого: {total_ton} TON</b>\n\n'
    admin_text += '<b>📦 Доставка:</b>\n'
    admin_text += f'Имя: {delivery.get("name", "—")}\n'
    admin_text += f'Страна: {delivery.get("country", "—")}\n'
    admin_text += f'Город: {delivery.get("city", "—")}\n'
    admin_text += f'Адрес: {delivery.get("address", "—")}\n'
    admin_text += f'Индекс: {delivery.get("postal", "—")}\n'
    admin_text += f'Телефон/email: {delivery.get("phone", "—")}\n'
    if delivery.get("comment"):
        admin_text += f'Комментарий: {delivery.get("comment")}\n'

    send_message(ADMIN_ID, admin_text)

    return {'ok': True}

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)

import os
import json
from flask import Flask, request
import requests

TOKEN = os.environ.get('BOT_TOKEN')
ADMIN_ID = 364102600
WEBHOOK_URL = os.environ.get('WEBHOOK_URL')

app = Flask(__name__)

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

@app.route('/order', methods=['POST'])
def order():
    data = request.json
    if not data:
        return {'ok': False}

    chat_id = data.get('chat_id')
    user_name = data.get('user_name', 'Неизвестен')
    items = data.get('items', [])
    total = sum(i['price'] for i in items)

    if chat_id:
        order_text = '✅ <b>Ваш заказ принят!</b>\n\n'
        for item in items:
            order_text += f'🎨 {item["title"]} — ₽{item["price"]}\n'
        order_text += f'\n💰 Итого: ₽{total}\n\nМы свяжемся с вами в ближайшее время!'
        send_message(chat_id, order_text)

    admin_text = '🛍 <b>НОВЫЙ ЗАКАЗ!</b>\n\n'
    admin_text += f'👤 {user_name}\n'
    admin_text += f'🆔 ID: {chat_id}\n\n'
    for item in items:
        admin_text += f'🎨 {item["title"]} — ₽{item["price"]}\n'
    admin_text += f'\n💰 Итого: ₽{total}'
    send_message(ADMIN_ID, admin_text)

    return {'ok': True}

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)

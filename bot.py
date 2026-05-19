import os
import json
from flask import Flask, request
import requests

TOKEN = os.environ.get('BOT_TOKEN')
ADMIN_ID = 364102600

app = Flask(__name__)

def send_message(chat_id, text):
    url = f'https://api.telegram.org/bot{TOKEN}/sendMessage'
    requests.post(url, json={'chat_id': chat_id, 'text': text, 'parse_mode': 'HTML'})

@app.route('/')
def index():
    return 'Oil&Soul Bot is running'

@app.route(f'/webhook', methods=['POST'])
def webhook():
    data = request.json
    if not data:
        return 'ok'
    
    # Обычное сообщение
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
    
    # Данные из Mini App (заказ)
    if 'web_app_data' in data.get('message', {}):
        msg = data['message']
        chat_id = msg['chat']['id']
        user = msg['chat']
        order_data = json.loads(msg['web_app_data']['data'])
        
        if order_data.get('action') == 'order':
            items = order_data['items']
            total = sum(i['price'] for i in items)
            total_stars = sum(i['stars'] for i in items)
            
            # Покупателю
            order_text = '✅ <b>Ваш заказ принят!</b>\n\n'
            for item in items:
                order_text += f'🎨 {item["title"]} — ₽{item["price"]}\n'
            order_text += f'\n💰 Итого: ₽{total}\n⭐ {total_stars} Stars\n\n'
            order_text += 'Мы свяжемся с вами в ближайшее время!'
            send_message(chat_id, order_text)
            
            # Тебе в личку
            admin_text = f'🛍 <b>НОВЫЙ ЗАКАЗ!</b>\n\n'
            admin_text += f'👤 Покупатель: {user.get("first_name", "")} {user.get("last_name", "")}\n'
            admin_text += f'🆔 ID: {chat_id}\n\n'
            for item in items:
                admin_text += f'🎨 {item["title"]} — ₽{item["price"]}\n'
            admin_text += f'\n💰 Итого: ₽{total}'
            send_message(ADMIN_ID, admin_text)
    
    return 'ok'

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)

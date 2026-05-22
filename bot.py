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

user_states = {}

def send_message(chat_id, text, reply_markup=None):
    url = f'https://api.telegram.org/bot{TOKEN}/sendMessage'
    payload = {'chat_id': chat_id, 'text': text, 'parse_mode': 'HTML'}
    if reply_markup:
        payload['reply_markup'] = json.dumps(reply_markup)
    requests.post(url, json=payload)

def set_webhook():
    url = f'https://api.telegram.org/bot{TOKEN}/setWebhook'
    r = requests.post(url, json={'url': WEBHOOK_URL})
    print('Webhook set:', r.json())

def start_custom_flow(chat_id, user_name):
    user_states[chat_id] = {'step': 'wait_link', 'user_name': user_name, 'delivery': {}}
    send_message(chat_id,
        '🎨 <b>Картина с вашего коллекционного подарка Telegram</b>\n\n'
        'Напишем маслом на холсте 30×30 см ваш цифровой подарок. '
        'На картине будет нарисован уникальный NFT-номер.\n\n'
        '<b>Стоимость:</b> 149 TON\n'
        '<b>Срок:</b> 21 день + доставка\n\n'
        '📎 <b>Пришлите ссылку на ваш подарок.</b>\n\n'
        'Как получить ссылку:\n'
        '1. Telegram → ваш профиль → <b>«Мои подарки»</b>\n'
        '2. Нажмите на нужный подарок\n'
        '3. Нажмите <b>«Поделиться»</b> → скопируйте ссылку\n\n'
        'Ссылка выглядит так: <code>https://t.me/nft/...</code>'
    )

def ask_delivery(chat_id):
    user_states[chat_id]['step'] = 'wait_name'
    send_message(chat_id,
        '✅ Отлично! Ссылку получили.\n\n'
        '📦 Теперь заполним данные для доставки.\n\n'
        'Введите ваше <b>имя и фамилию:</b>'
    )

def notify_admin_custom(chat_id, state):
    d = state.get('delivery', {})
    text = (
        '🖌 <b>НОВЫЙ КАСТОМНЫЙ ЗАКАЗ!</b>\n\n'
        f'👤 <b>Покупатель:</b> {state.get("user_name", "—")}\n'
        f'🆔 ID: {chat_id}\n\n'
        f'🔗 <b>Подарок:</b> {state.get("gift_link", "—")}\n\n'
        f'🖼 Размер: 30×30 см\n'
        f'💎 Стоимость: 149 TON\n\n'
        f'📦 <b>Доставка:</b>\n'
        f'Имя: {d.get("name", "—")}\n'
        f'Страна: {d.get("country", "—")}\n'
        f'Город: {d.get("city", "—")}\n'
        f'Адрес: {d.get("address", "—")}\n'
        f'Индекс: {d.get("postal", "—")}\n'
        f'Телефон: {d.get("phone", "—")}\n'
        f'Email: {d.get("email", "—")}\n'
    )
    if d.get('comment'):
        text += f'Комментарий: {d.get("comment")}\n'
    send_message(ADMIN_ID, text)

DELIVERY_STEPS = [
    ('wait_name',    'wait_country', 'name',    'Введите вашу <b>страну:</b>'),
    ('wait_country', 'wait_city',    'country', 'Введите ваш <b>город:</b>'),
    ('wait_city',    'wait_address', 'city',    'Введите ваш <b>адрес</b> (улица, дом, квартира):'),
    ('wait_address', 'wait_postal',  'address', 'Введите ваш <b>почтовый индекс:</b>'),
    ('wait_postal',  'wait_phone',   'postal',  'Введите ваш <b>телефон:</b>'),
    ('wait_phone',   'wait_email',   'phone',   'Введите ваш <b>email:</b>'),
    ('wait_email',   'wait_comment', 'email',   'Комментарий к заказу (или отправьте <b>—</b> если нет):'),
    ('wait_comment', 'done',         'comment', None),
]

@app.route('/')
def index():
    set_webhook()
    return 'Oil&Soul Bot is running'

@app.route('/webhook', methods=['POST'])
def webhook():
    data = request.json
    if not data:
        return 'ok'

    if 'message' not in data:
        return 'ok'

    msg = data['message']
    chat_id = msg['chat']['id']
    text = msg.get('text', '').strip()
    user = msg.get('from', {})
    user_name = f"{user.get('first_name', '')} {user.get('last_name', '')}".strip() or 'Неизвестен'

    state = user_states.get(chat_id, {})
    step = state.get('step')

    # /start
    if text.startswith('/start'):
        if 'custom' in text:
            start_custom_flow(chat_id, user_name)
        else:
            user_states.pop(chat_id, None)
            send_message(chat_id,
                '🎨 <b>Добро пожаловать в Oil&Soul!</b>\n\n'
                'Уникальные картины маслом в стиле Telegram-подарков.\n\n'
                'Откройте магазин кнопкой ниже или напишите <b>заказ</b> '
                'чтобы заказать картину с вашего подарка.'
            )
        return 'ok'

    # Ключевые слова для запуска кастомного флоу
    if not step and any(word in text.lower() for word in ['заказ', 'картин', 'подарок', 'custom', 'order']):
        start_custom_flow(chat_id, user_name)
        return 'ok'

    # Флоу — ожидание ссылки
    if step == 'wait_link':
        if 't.me' in text or 'telegram' in text.lower():
            user_states[chat_id]['gift_link'] = text
            ask_delivery(chat_id)
        else:
            send_message(chat_id,
                '⚠️ Пожалуйста, пришлите ссылку на подарок.\n\n'
                'Ссылка выглядит так: <code>https://t.me/nft/...</code>\n\n'
                '1. Telegram → профиль → <b>«Мои подарки»</b>\n'
                '2. Нажмите на подарок → <b>«Поделиться»</b> → скопируйте ссылку'
            )
        return 'ok'

    # Шаги доставки
    for current, next_step, field_key, next_prompt in DELIVERY_STEPS:
        if step == current:
            if 'delivery' not in user_states[chat_id]:
                user_states[chat_id]['delivery'] = {}
            user_states[chat_id]['delivery'][field_key] = text
            user_states[chat_id]['step'] = next_step

            if next_step == 'done':
                d = user_states[chat_id]['delivery']
                confirm_text = (
                    '📋 <b>Ваш заказ:</b>\n\n'
                    f'🔗 Подарок: {user_states[chat_id].get("gift_link", "—")}\n'
                    f'🖼 Размер: 30×30 см, масло на холсте\n'
                    f'🔢 Уникальный NFT-номер на картине\n'
                    f'💎 Стоимость: <b>149 TON</b>\n'
                    f'⏱ Срок: 21 день + доставка\n\n'
                    f'📦 <b>Доставка:</b>\n'
                    f'{d.get("name", "—")}\n'
                    f'{d.get("country", "—")}, {d.get("city", "—")}\n'
                    f'{d.get("address", "—")}, {d.get("postal", "—")}\n'
                    f'{d.get("phone", "—")} | {d.get("email", "—")}\n\n'
                    f'💳 <b>Оплата — переведите 149 TON на адрес:</b>\n'
                    f'<code>{TON_WALLET}</code>\n\n'
                    f'После перевода пришлите сюда скриншот транзакции 🎨'
                )
                send_message(chat_id, confirm_text)
                notify_admin_custom(chat_id, user_states[chat_id])
                user_states.pop(chat_id, None)
            else:
                send_message(chat_id, next_prompt)
            return 'ok'

    # Любое другое сообщение — предлагаем начать
    send_message(chat_id,
        'Напишите <b>заказ</b> — и мы напишем картину маслом с вашего коллекционного подарка Telegram.'
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
        f'👤 <b>Покупатель:</b> {user_name}\n'
        f'🆔 ID: {chat_id}\n\n'
        '<b>Товары:</b>\n'
    )
    for item in items:
        admin_text += f'🎨 {item["title"]} — {item.get("ton", 0)} TON\n'
    admin_text += (
        f'\n💎 <b>Итого: {total_ton} TON</b>\n\n'
        f'<b>📦 Доставка:</b>\n'
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

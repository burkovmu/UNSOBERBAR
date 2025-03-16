import os
import json
import requests
from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs

# Получаем токен бота из переменных окружения
TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN')
WEBAPP_URL = os.environ.get('WEBAPP_URL', 'https://restaurant-mike.vercel.app/telegram-webapp.html')

def send_telegram_message(chat_id, text, reply_markup=None):
    """Отправка сообщения в Telegram"""
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "HTML"
    }
    
    if reply_markup:
        payload["reply_markup"] = reply_markup
        
    response = requests.post(url, json=payload)
    return response.json()

def handle_telegram_update(update):
    """Обработка обновления от Telegram"""
    # Проверяем, есть ли сообщение в обновлении
    if 'message' in update:
        message = update['message']
        chat_id = message['chat']['id']
        
        # Проверяем, есть ли текст в сообщении
        if 'text' in message:
            text = message['text']
            
            # Обработка команд
            if text == '/start' or text == '/menu':
                # Создаем клавиатуру с кнопкой для открытия WebApp
                keyboard = {
                    'inline_keyboard': [
                        [
                            {
                                'text': 'Открыть меню ресторана',
                                'web_app': {'url': WEBAPP_URL}
                            }
                        ]
                    ]
                }
                
                # Отправляем приветственное сообщение с клавиатурой
                send_telegram_message(
                    chat_id,
                    "Добро пожаловать в наш ресторан! Нажмите на кнопку ниже, чтобы открыть меню.",
                    json.dumps(keyboard)
                )
                
    return {"status": "ok"}

def handle_webhook_setup(query_params):
    """Настройка webhook для бота"""
    url = query_params.get('url', [''])[0]
    
    if not url:
        return {"error": "URL parameter is required"}
    
    # Устанавливаем webhook
    set_webhook_url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/setWebhook?url={url}"
    response = requests.get(set_webhook_url)
    
    return response.json()

def handle_webhook_info():
    """Получение информации о текущем webhook"""
    info_url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/getWebhookInfo"
    response = requests.get(info_url)
    
    return response.json()

def handler(request):
    """Обработчик запросов для Vercel"""
    # Обработка GET запросов (для настройки webhook)
    if request.method == 'GET':
        # Парсим параметры запроса
        query_params = parse_qs(request.query_string.decode())
        
        # Проверяем, запрашивается ли информация о webhook
        if 'info' in query_params:
            return handle_webhook_info()
        
        # Проверяем, запрашивается ли настройка webhook
        if 'setup' in query_params:
            return handle_webhook_setup(query_params)
        
        # Если нет специальных параметров, возвращаем информацию о API
        return {
            "status": "ok",
            "message": "Telegram Bot API is running. Use POST for webhook or GET with parameters for setup."
        }
    
    # Обработка POST запросов (webhook от Telegram)
    elif request.method == 'POST':
        try:
            # Получаем данные из тела запроса
            update = json.loads(request.body)
            
            # Обрабатываем обновление
            return handle_telegram_update(update)
        except Exception as e:
            return {"error": str(e)}
    
    # Обработка других методов
    else:
        return {"error": "Method not allowed"}

# Обработчик для Vercel
def lambda_handler(event, context):
    """AWS Lambda handler для Vercel"""
    return handler(event)

# Для локального тестирования
if __name__ == "__main__":
    # Пример обработки команды /start
    update = {
        "message": {
            "chat": {"id": 123456789},
            "text": "/start"
        }
    }
    print(handle_telegram_update(update)) 
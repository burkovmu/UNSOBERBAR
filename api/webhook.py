from http.server import BaseHTTPRequestHandler
import os
import json
import logging
from aiogram import Bot, types
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo

# Настройка логирования
logging.basicConfig(level=logging.INFO)

# Инициализация бота
API_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
WEBAPP_URL = os.getenv('WEBAPP_URL', 'https://restaurant-mike.vercel.app/telegram-webapp.html')

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            update_json = json.loads(post_data.decode('utf-8'))
            
            # Обработка запроса асинхронно
            self.process_update(update_json)
            
            # Отправляем успешный ответ
            self.send_response(200)
            self.end_headers()
            self.wfile.write("OK".encode())
            
        except Exception as e:
            logging.error(f"Ошибка при обработке запроса: {str(e)}")
            self.send_response(200)  # Всегда отвечаем 200, чтобы Telegram не блокировал webhook
            self.end_headers()
            self.wfile.write(f"Error: {str(e)}".encode())
    
    def process_update(self, update_json):
        """Обработка обновления от Telegram"""
        try:
            # Инициализация бота
            bot = Bot(token=API_TOKEN)
            
            # Проверяем, есть ли сообщение в обновлении
            if 'message' in update_json:
                chat_id = update_json['message']['chat']['id']
                
                # Проверяем, есть ли текст в сообщении
                if 'text' in update_json['message']:
                    text = update_json['message']['text']
                    
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
                        
                        # Отправляем сообщение с клавиатурой
                        message_data = {
                            'chat_id': chat_id,
                            'text': 'Добро пожаловать в наш ресторан! Нажмите на кнопку ниже, чтобы открыть меню.',
                            'reply_markup': json.dumps(keyboard)
                        }
                        
                        # Отправляем запрос к API Telegram
                        import requests
                        requests.post(
                            f'https://api.telegram.org/bot{API_TOKEN}/sendMessage',
                            json=message_data
                        )
                        
        except Exception as e:
            logging.error(f"Ошибка при обработке обновления: {str(e)}")

def main(request):
    """Точка входа для Vercel"""
    if request.method == 'POST':
        # Создаем экземпляр обработчика
        h = handler()
        h.do_POST()
        return {'statusCode': 200, 'body': 'OK'}
    else:
        return {'statusCode': 405, 'body': 'Method Not Allowed'} 
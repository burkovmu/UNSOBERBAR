import os
import logging
from aiogram import Bot, Dispatcher, types
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from aiogram.utils import executor

# Настройка логирования
logging.basicConfig(level=logging.INFO)

# Инициализация бота
# Замените 'YOUR_BOT_TOKEN' на токен вашего бота, полученный от @BotFather
API_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN', 'YOUR_BOT_TOKEN')
bot = Bot(token=API_TOKEN)
dp = Dispatcher(bot)

# Замените 'YOUR_WEBSITE_URL' на URL вашего сайта
# Например: https://example.com/telegram-webapp.html
WEBAPP_URL = os.getenv('WEBAPP_URL', 'YOUR_WEBSITE_URL/telegram-webapp.html')

@dp.message_handler(commands=['start'])
async def cmd_start(message: types.Message):
    """
    Обработчик команды /start
    """
    # Создаем клавиатуру с кнопкой для открытия WebApp
    keyboard = InlineKeyboardMarkup()
    keyboard.add(InlineKeyboardButton(
        text="Открыть меню ресторана", 
        web_app=WebAppInfo(url=WEBAPP_URL)
    ))
    
    # Отправляем приветственное сообщение с клавиатурой
    await message.answer(
        "Добро пожаловать в наш ресторан! Нажмите на кнопку ниже, чтобы открыть меню.",
        reply_markup=keyboard
    )

@dp.message_handler(commands=['menu'])
async def cmd_menu(message: types.Message):
    """
    Обработчик команды /menu
    """
    # Создаем клавиатуру с кнопкой для открытия WebApp
    keyboard = InlineKeyboardMarkup()
    keyboard.add(InlineKeyboardButton(
        text="Открыть меню ресторана", 
        web_app=WebAppInfo(url=WEBAPP_URL)
    ))
    
    # Отправляем сообщение с клавиатурой
    await message.answer(
        "Нажмите на кнопку ниже, чтобы открыть меню нашего ресторана.",
        reply_markup=keyboard
    )

@dp.message_handler(content_types=types.ContentTypes.WEB_APP_DATA)
async def web_app_data(message: types.Message):
    """
    Обработчик данных, отправленных из WebApp
    """
    # Получаем данные из WebApp
    data = message.web_app_data.data
    
    # Отправляем подтверждение получения данных
    await message.answer(f"Получены данные из WebApp: {data}")

if __name__ == '__main__':
    # Запускаем бота
    executor.start_polling(dp, skip_updates=True) 
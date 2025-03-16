#!/bin/bash

# Проверяем, что переменные окружения установлены
if [ -z "$TELEGRAM_BOT_TOKEN" ]; then
  echo "Ошибка: Переменная окружения TELEGRAM_BOT_TOKEN не установлена"
  echo "Установите ее с помощью команды: export TELEGRAM_BOT_TOKEN=ваш_токен"
  exit 1
fi

if [ -z "$WEBHOOK_URL" ]; then
  echo "Ошибка: Переменная окружения WEBHOOK_URL не установлена"
  echo "Установите ее с помощью команды: export WEBHOOK_URL=https://ваш-домен.vercel.app/api"
  exit 1
fi

# Устанавливаем webhook
echo "Устанавливаем webhook для бота..."
RESPONSE=$(curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"$WEBHOOK_URL\"}")

# Проверяем ответ
if [[ $RESPONSE == *"\"ok\":true"* ]]; then
  echo "Webhook успешно установлен!"
  echo "Ответ API: $RESPONSE"
else
  echo "Ошибка при установке webhook"
  echo "Ответ API: $RESPONSE"
  exit 1
fi

# Получаем информацию о webhook
echo -e "\nПолучаем информацию о webhook..."
INFO_RESPONSE=$(curl -s "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getWebhookInfo")
echo "Информация о webhook: $INFO_RESPONSE"

echo -e "\nНастройка завершена. Теперь вы можете проверить работу бота, отправив ему команду /start" 
# Деплой Telegram бота на Vercel

Этот документ содержит инструкции по деплою Telegram бота и WebApp на платформу Vercel.

## Предварительные требования

1. Аккаунт на [Vercel](https://vercel.com)
2. Аккаунт на [GitHub](https://github.com)
3. Токен Telegram бота (получается через [@BotFather](https://t.me/BotFather))

## Шаги по деплою

### 1. Подготовка репозитория

1. Создайте репозиторий на GitHub или используйте существующий
2. Убедитесь, что в репозитории есть следующие файлы:
   - `vercel.json` - конфигурация для Vercel
   - `api/index.py` - серверлесс-функция для обработки webhook
   - `api/requirements.txt` - зависимости для Python
   - `public/telegram-webapp.html` - HTML-файл для WebApp

### 2. Деплой на Vercel

1. Войдите в аккаунт на [Vercel](https://vercel.com)
2. Нажмите "Add New..." -> "Project"
3. Выберите ваш репозиторий из списка
4. Настройте проект:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: оставьте пустым
   - Output Directory: public
5. Нажмите "Environment Variables" и добавьте:
   - `TELEGRAM_BOT_TOKEN` - токен вашего Telegram бота
   - `WEBAPP_URL` - URL вашего WebApp (например, `https://ваш-домен.vercel.app/telegram-webapp.html`)
6. Нажмите "Deploy"

### 3. Настройка webhook для Telegram бота

После успешного деплоя на Vercel, настройте webhook для вашего бота:

1. Откройте в браузере URL:
```
https://api.telegram.org/bot<ВАШ_ТОКЕН>/setWebhook?url=https://ваш-домен.vercel.app/api
```

2. Вы должны получить ответ:
```json
{"ok":true,"result":true,"description":"Webhook was set"}
```

3. Для проверки статуса webhook откройте:
```
https://api.telegram.org/bot<ВАШ_ТОКЕН>/getWebhookInfo
```

### 4. Проверка работоспособности

1. Найдите вашего бота в Telegram
2. Отправьте команду `/start` или `/menu`
3. Бот должен ответить сообщением с кнопкой для открытия WebApp
4. Нажмите на кнопку и убедитесь, что WebApp открывается и отображает ваш сайт

## Устранение неполадок

### Webhook не работает

1. Проверьте логи в панели Vercel (раздел "Deployments" -> выберите последний деплой -> "Functions")
2. Убедитесь, что токен бота указан правильно в переменных окружения
3. Проверьте, что URL webhook указан правильно

### WebApp не открывается

1. Убедитесь, что файл `telegram-webapp.html` находится в директории `public`
2. Проверьте, что URL в переменной окружения `WEBAPP_URL` указан правильно
3. Проверьте, что ваш сайт доступен по HTTPS

### Бот не отвечает

1. Проверьте, что бот активирован в [@BotFather](https://t.me/BotFather)
2. Убедитесь, что webhook настроен правильно
3. Проверьте логи в панели Vercel 
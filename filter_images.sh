#!/bin/bash

# Создаем директорию для отфильтрованных изображений
mkdir -p public/uploads_filtered

# Копируем только небольшие изображения (менее 5 МБ)
find public/uploads -type f -size -5M \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.webp" -o -name "*.avif" -o -name "*.gif" \) -exec cp {} public/uploads_filtered/ \;

# Выводим информацию о количестве скопированных файлов
echo "Скопировано $(ls -1 public/uploads_filtered | wc -l) файлов изображений (менее 5 МБ)"

# Добавляем отфильтрованные изображения в Git
git add public/uploads_filtered

echo "Отфильтрованные изображения добавлены в Git" 
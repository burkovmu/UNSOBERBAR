import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json();
    
    if (!imageUrl || !imageUrl.startsWith('/uploads/')) {
      return NextResponse.json(
        { error: 'Некорректный URL изображения' },
        { status: 400 }
      );
    }

    const filename = imageUrl.split('/').pop();
    if (!filename) {
      return NextResponse.json(
        { error: 'Не удалось получить имя файла' },
        { status: 400 }
      );
    }

    const filePath = path.join(uploadsDir, filename);
    
    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
      return NextResponse.json({ success: true });
    } catch (error) {
      // Файл не существует или не может быть удален
      console.error('Ошибка при удалении файла:', error);
      return NextResponse.json(
        { error: 'Файл не существует или не может быть удален' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Ошибка при обработке запроса:', error);
    return NextResponse.json(
      { error: 'Ошибка при обработке запроса' },
      { status: 500 }
    );
  }
} 
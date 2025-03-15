import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

export async function GET() {
  try {
    // Проверяем существование директории
    try {
      await fs.access(uploadsDir);
    } catch {
      return NextResponse.json({ 
        error: 'Директория uploads не существует',
        path: uploadsDir
      }, { status: 404 });
    }

    // Получаем список файлов
    const files = await fs.readdir(uploadsDir);
    
    // Проверяем права доступа
    const stats = await fs.stat(uploadsDir);
    const permissions = stats.mode.toString(8).slice(-3);

    return NextResponse.json({
      success: true,
      path: uploadsDir,
      files: files.slice(0, 10), // Возвращаем только первые 10 файлов
      fileCount: files.length,
      permissions
    });
  } catch (error) {
    console.error('Ошибка при проверке изображений:', error);
    return NextResponse.json({ 
      error: 'Ошибка при проверке изображений',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 
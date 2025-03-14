import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { MenuCategory } from '@/types/menu';

const menuPath = path.join(process.cwd(), 'data', 'menu.json');

// Убедимся, что директория существует
async function ensureDirectoryExists() {
  const dir = path.dirname(menuPath);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

// Загрузка меню
export async function GET() {
  try {
    // Проверяем существование директории
    const dir = path.dirname(menuPath);
    await fs.mkdir(dir, { recursive: true });

    // Проверяем существование файла
    try {
      await fs.access(menuPath);
    } catch {
      // Если файл не существует, создаем его с пустым массивом
      await fs.writeFile(menuPath, '[]');
    }

    // Читаем данные
    const data = await fs.readFile(menuPath, 'utf-8');
    const menu = JSON.parse(data);

    return NextResponse.json(menu);
  } catch (error) {
    console.error('Ошибка при загрузке меню:', error);
    return NextResponse.json({ error: 'Ошибка при загрузке меню' }, { status: 500 });
  }
}

// Сохранение меню
export async function POST(request: Request) {
  try {
    const menu: MenuCategory[] = await request.json();
    
    // Проверяем существование директории
    const dir = path.dirname(menuPath);
    await fs.mkdir(dir, { recursive: true });

    // Сохраняем данные
    await fs.writeFile(menuPath, JSON.stringify(menu, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка при сохранении меню:', error);
    return NextResponse.json({ error: 'Ошибка при сохранении меню' }, { status: 500 });
  }
} 
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CheckImagesPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testImage, setTestImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/check-images');
        const result = await response.json();
        setData(result);
        
        // Выбираем случайное изображение для теста
        if (result.files && result.files.length > 0) {
          setTestImage(`/uploads/${result.files[0]}`);
        }
      } catch (err) {
        setError('Ошибка при загрузке данных');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Проверка изображений</h1>
        
        <div className="mb-8">
          <Link href="/" className="text-[#E6B980] hover:underline">
            Вернуться на главную
          </Link>
        </div>
        
        {loading ? (
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg">
            {error}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-[#111111] rounded-lg border border-white/10 p-6">
              <h2 className="text-xl font-medium mb-4">Информация о директории</h2>
              <div className="space-y-2">
                <p><span className="text-white/60">Путь:</span> {data.path}</p>
                <p><span className="text-white/60">Права доступа:</span> {data.permissions}</p>
                <p><span className="text-white/60">Количество файлов:</span> {data.fileCount}</p>
              </div>
            </div>
            
            {data.files && data.files.length > 0 ? (
              <div className="bg-[#111111] rounded-lg border border-white/10 p-6">
                <h2 className="text-xl font-medium mb-4">Список файлов (первые 10)</h2>
                <ul className="space-y-1">
                  {data.files.map((file: string) => (
                    <li key={file} className="text-white/80">{file}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 p-4 rounded-lg">
                Файлы не найдены
              </div>
            )}
            
            {testImage && (
              <div className="bg-[#111111] rounded-lg border border-white/10 p-6">
                <h2 className="text-xl font-medium mb-4">Тестовое изображение</h2>
                <div className="space-y-4">
                  <p className="text-white/60">Путь: {testImage}</p>
                  
                  <div className="border border-white/10 rounded-lg p-2 inline-block">
                    <div className="relative w-64 h-64">
                      <Image 
                        src={testImage} 
                        alt="Тестовое изображение" 
                        fill
                        className="object-cover rounded"
                        unoptimized
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Прямая ссылка на изображение:</h3>
                    <div className="bg-black/30 p-2 rounded overflow-x-auto">
                      <code className="text-green-400">{`${window.location.origin}${testImage}`}</code>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Проверка через img тег:</h3>
                    <div className="border border-white/10 rounded-lg p-2 inline-block">
                      <img 
                        src={testImage} 
                        alt="Тестовое изображение через img тег" 
                        className="max-w-full h-auto max-h-64 rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 
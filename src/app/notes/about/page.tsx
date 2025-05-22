'use client';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

export default function AboutPage() {
    return (
        <>
            <div className="container mx-auto py-6 pl-4">
                <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold text-white text-center mb-6">О проекте NodeNexus</h1>
                    <p className="text-gray-300 mb-4">
                        NodeNexus — это инновационное приложение для управления заметками с визуализацией связей между ними в виде графа. Оно помогает организовать ваши мысли, идеи и проекты, создавая интерактивную сеть знаний.
                    </p>
                    <h2 className="text-xl font-semibold text-white mt-6 mb-2">Основные возможности:</h2>
                    <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                        <li>Создание и редактирование заметок с тегами и задачами.</li>
                        <li>Визуализация связей между заметками в графическом формате.</li>
                        <li>Простая навигация через интуитивный интерфейс.</li>
                        <li>Синхронизация аккаунта для доступа с разных устройств.</li>
                    </ul>
                    <h2 className="text-xl font-semibold text-white mt-6 mb-2">Использование искусственного интелекта</h2>
                    <p className="text-gray-300 mb-4">
                        При создании проекта был использован ИИ ассистент Grok для ускорения создания и оптимизации приложения по части интерфейса и дизайна.
                        Это позволило уделить больше внимания логике и функционалу приложения.
                    </p>
                    <p className="text-gray-400 text-center mt-6">
                        Разработано Сорином.М.А
                    </p>
                    <div className="mt-6 text-center">
                        <Link href="/" className="btn bg-gray-600 hover:brightness-110 mr-2">
                            На главную
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
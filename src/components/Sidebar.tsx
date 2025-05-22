'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();

    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      const toggleButton = document.getElementById('sidebar-toggle');

      if (
        isOpen &&
        sidebar &&
        toggleButton &&
        !sidebar.contains(event.target as Node) &&
        !toggleButton.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    window.location.href = '/auth';
  };

  return (
    <>
      <button
        id="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 bg-gray-600 p-2 rounded-md text-white hover:bg-gray-700 "
      >
        {isOpen ? '×' : '☰'}
      </button>
      <div
        id="sidebar"
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-transform duration-300 ease-in-out z-40 ${isOpen ? 'w-64' : 'w-0 overflow-hidden'
          }`}
        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(-100%)' }}
      >
        <div className="flex flex-col h-full p-6 justify-between">
          <h1 className="text-2xl font-bold mb-6 ml-8">NodeNexus</h1>
          <nav>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="hover:text-gray-300">Главная</Link>
              </li>
              <li>
                <Link href="/notes" className="hover:text-gray-300">Заметки</Link>
              </li>
              <li>
                <Link href="/notes/add" className="hover:text-gray-300">Добавить заметку</Link>
              </li>
              <li>
                <Link href="/notes/about" className="hover:text-gray-300">О проекте</Link>
              </li>
            </ul>
          </nav>
          <div className="mt-auto">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full mt-4 p-2 rounded-md hover:text-gray-300 text-white"
              >
                Выйти
              </button>
            ) : (
              <Link href="/auth" className="w-full mt-4 bg-blue-600 p-2 rounded-md hover:bg-blue-700 text-white block text-center">
                Зарегистрироваться/Войти
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
'use client';
import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function Sidebar() {
  const [user, setUser] = useState<any>(null);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <aside className="w-64 bg-base-200 p-6 shadow-xl h-screen">
      <nav>
        <ul className="menu menu-compact">
          <li className="mb-2"><Link href="/" className="text-lg hover:bg-gray-700 hover:text-white rounded">Главная</Link></li>
          {user ? (
            <>
              <li className="mb-2"><Link href="/notes/add" className="text-lg hover:bg-gray-700 hover:text-white rounded">Добавить заметку</Link></li>
              <li className="mb-2"><Link href="/graph" className="text-lg hover:bg-gray-700 hover:text-white rounded">Граф</Link></li>
              <li className="mb-2"><Link href="/about" className="text-lg hover:bg-gray-700 hover:text-white rounded">О проекте</Link></li>
            </>
          ) : (
            <li className="mb-2"><Link href="/auth" className="text-lg hover:bg-gray-700 hover:text-white rounded">Войти</Link></li>
          )}
        </ul>
      </nav>
    </aside>
  );
}
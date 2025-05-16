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
    <aside className="w-64 bg-base-200 p-4">
      <nav>
        <ul className="menu">
          <li><Link href="/">Главная</Link></li>
          {user ? (
            <>
              <li><Link href="/notes/add">Добавить заметку</Link></li>
              <li><Link href="/graph">Граф</Link></li>
              <li><Link href="/about">О проекте</Link></li>
            </>
          ) : (
            <li><Link href="/auth">Войти</Link></li>
          )}
        </ul>
      </nav>
    </aside>
  );
}
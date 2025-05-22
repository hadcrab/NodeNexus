'use client';
import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import NoteEditor from '@/components/NoteEditor';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AddNotePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error fetching user:', userError);
        setError('Ошибка при получении пользователя. Попробуйте войти заново.');
      } else if (!user) {
        router.push('/auth');
      } else {
        setUserId(user.id);
      }
      setIsLoading(false);
    };

    fetchUser();
  }, [router]);

  const handleSave = () => {
    router.push('/');
  };

  const handleCancel = () => {
    router.push('/');
  };

  if (isLoading) return <p className="text-center text-gray-400">Загрузка...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!userId) return null;

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-4xl font-extrabold text-center mb-6 text-foreground">Добавить заметку</h1>
      <NoteEditor userId={userId} onSave={handleSave} onCancel={handleCancel} />
      <div className="mt-4 text-center">
        <Link href="/" className="btn bg-gray-600 hover:brightness-110">
          Назад
        </Link>
      </div>
    </div>
  );
}
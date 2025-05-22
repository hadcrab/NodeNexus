import { createSupabaseServerClient } from '@/lib/supabaseServer';
import Link from 'next/link';
import NoteList from '@/components/NoteList';

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-4xl font-extrabold text-center mb-6 text-foreground">NodeNexus</h1>
      <p className="text-lg text-center mb-8 text-gray-400">Храните и визуализируйте свои знания с помощью графа.</p>
      {user ? (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-foreground">Ваши заметки</h2>
          <NoteList userId={user.id} />
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-500 mb-4">Войдите, чтобы начать.</p>
          <Link href="/auth" className="btn">Войти / Зарегистрироваться</Link>
        </div>
      )}
    </div>
  );
}
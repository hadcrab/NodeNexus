import { createSupabaseServerClient } from '@/lib/supabaseServer';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';

type Note = {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  relations: string[];
  created_at: string;
  updated_at: string;
};

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let notes: Note[] = [];
  if (user) {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
      return <div>Ошибка загрузки заметок</div>;
    }
    notes = data || [];
  }

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold">NodeNexus</h1>
      <p>Храните и визуализируйте свои знания с помощью графа.</p>
      {user ? (
        <div className="mt-4">
          <h2 className="text-xl">Ваши заметки</h2>
          {notes.length > 0 ? (
            <ul className="list-disc mx-auto w-fit">
              {notes.map((note) => (
                <li key={note.id}>{note.title}</li>
              ))}
            </ul>
          ) : (
            <p>Заметок пока нет. <Link href="/notes/add" className="link">Добавить?</Link></p>
          )}
          <LogoutButton />
        </div>
      ) : (
        <div className="mt-4">
          <p>Войдите, чтобы начать.</p>
          <Link href="/auth" className="btn btn-primary mt-2">
            Войти / Зарегистрироваться
          </Link>
        </div>
      )}
    </div>
  );
}
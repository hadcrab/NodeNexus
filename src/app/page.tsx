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
      return <div className="text-red-500">Ошибка загрузки заметок</div>;
    }
    notes = data || [];
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-extrabold text-center mb-6 text-white">NodeNexus</h1>
      <p className="text-lg text-center mb-8 text-gray-300">Храните и визуализируйте свои знания с помощью графа.</p>
      {user ? (
        <div className="bg-base-100 p-6 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">Ваши заметки</h2>
          {notes.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map((note) => (
                <li key={note.id} className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                  <p className="text-white">{note.title}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">Заметок пока нет. <Link href="/notes/add" className="text-blue-400 hover:underline">Добавить?</Link></p>
          )}
          <LogoutButton />
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-400 mb-4">Войдите, чтобы начать.</p>
          <Link href="/auth" className="btn btn-primary btn-lg">
            Войти / Зарегистрироваться
          </Link>
        </div>
      )}
    </div>
  );
}
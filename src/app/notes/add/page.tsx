'use client';
import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AddNote() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Войдите, чтобы добавить заметку');
      return;
    }

    const { error } = await supabase
      .from('notes')
      .insert({ title, content, user_id: user.id });

    if (error) {
      setError(error.message);
      return;
    }

    router.push('/');
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Добавить заметку</h1>
      <form onSubmit={handleSubmit} className="card bg-base-100 p-6 shadow-xl rounded-lg">
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text text-gray-200">Заголовок</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered bg-gray-800 text-white border-gray-700"
            required
          />
        </div>
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text text-gray-200">Содержание</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="textarea textarea-bordered bg-gray-800 text-white border-gray-700 h-32"
          />
        </div>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <button type="submit" className="btn btn-primary w-full">
          Сохранить
        </button>
      </form>
    </div>
  );
}
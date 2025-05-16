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
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Добавить заметку</h1>
      <form onSubmit={handleSubmit} className="card bg-base-200 p-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Заголовок</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Содержание</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="textarea textarea-bordered"
          />
        </div>
        {error && <p className="text-error mt-2">{error}</p>}
        <button type="submit" className="btn btn-primary mt-4">
          Сохранить
        </button>
      </form>
    </div>
  );
}
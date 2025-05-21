'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import NoteEditor from '@/components/NoteEditor';
import { useNoteStore } from '@/store/useNoteStore';

export default function NoteDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const supabase = createSupabaseBrowserClient();
  const { notes } = useNoteStore();
  const [isEditing, setIsEditing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
      else router.push('/auth');
    };
    fetchUser();
  }, [supabase, router]);

  const note = notes.find((n) => n.id === id);

  if (!note || !userId) {
    return <div className="text-center text-red-500 p-4">Заметка не найдена или доступ запрещён.</div>;
  }

  return (
    <div className="container mx-auto py-6">
      {isEditing ? (
        <div>
          <h1 className="text-3xl font-bold mb-6 text-foreground">Редактировать заметку</h1>
          <NoteEditor
            note={note}
            userId={userId}
            onSave={() => setIsEditing(false)}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      ) : (
        <div className="card bg-cardBg p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-foreground">{note.title}</h1>
            <button
              onClick={() => setIsEditing(true)}
              className="btn bg-primary hover:brightness-110"
            >
              Редактировать
            </button>
          </div>
          <p className="text-gray-400 mt-4">{note.content || 'Без содержимого'}</p>
          {note.tags.length > 0 && (
            <div className="mt-4">
              <h4 className="text-foreground font-semibold">Теги</h4>
              <div className="flex flex-wrap gap-1">
                {note.tags.map((tag) => (
                  <span key={tag} className="text-sm bg-gray-600 text-gray-200 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          {note.tasks.length > 0 && (
            <div className="mt-4">
              <h4 className="text-foreground font-semibold">Список задач</h4>
              <ul className="space-y-2">
                {note.tasks.map((task) => (
                  <li key={task.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => useNoteStore.getState().toggleTask(note.id, userId, task.id)}
                      className="h-4 w-4"
                    />
                    <span className={task.completed ? 'line-through text-gray-400' : 'text-foreground'}>
                      {task.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button
            onClick={() => router.push('/')}
            className="mt-4 btn bg-gray-600 hover:brightness-110"
          >
            Назад
          </button>
        </div>
      )}
    </div>
  );
}
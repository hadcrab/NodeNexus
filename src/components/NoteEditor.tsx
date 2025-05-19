'use client';
import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';

type NoteEditorProps = {
  note?: { id: string; title: string; content: string | null };
  onSave: () => void;
  onCancel: () => void;
};

export default function NoteEditor({ note, onSave, onCancel }: NoteEditorProps) {
  const supabase = createSupabaseBrowserClient();
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');

  const handleSave = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    if (note) {
      await supabase
        .from('notes')
        .update({ title, content, updated_at: new Date().toISOString() })
        .eq('id', note.id)
        .eq('user_id', user.id);
    } else {
      await supabase.from('notes').insert({
        user_id: user.id,
        title,
        content,
        relations: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
    onSave();
  };

  return (
    <div className="card bg-cardBg p-6 rounded-lg shadow-md">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Заголовок"
        className="input w-full mb-4 p-2 bg-cardBg text-foreground border border-gray-600 rounded"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Содержимое..."
        className="input w-full h-40 p-2 bg-cardBg text-foreground border border-gray-600 rounded"
      />
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onCancel} className="btn bg-gray-600 hover:brightness-110">
          Отмена
        </button>
        <button onClick={handleSave} className="btn bg-primary hover:brightness-110">
          Сохранить
        </button>
      </div>
    </div>
  );
}
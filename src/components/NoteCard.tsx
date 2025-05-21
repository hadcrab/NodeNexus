'use client';
import { Note } from '@/types/note';
import Link from 'next/link';
import { useNoteStore } from '@/store/useNoteStore';

type NoteCardProps = {
  note: Note;
  userId: string;
};

export default function NoteCard({ note, userId }: NoteCardProps) {
  const { deleteNote, toggleFavorite } = useNoteStore();

  const handleDeleteClick = async () => {
    if (confirm(`Удалить заметку "${note.title}"?`)) {
      await deleteNote(note.id, userId);
    }
  };

  const handleToggleFavorite = async () => {
    await toggleFavorite(note.id, userId);
  };

  return (
    <div className="card bg-cardBg p-4 rounded-lg shadow-md hover:bg-gray-700 transition-all">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-semibold text-foreground">{note.title}</h3>
        <button
          onClick={handleToggleFavorite}
          className={`p-1 rounded-full ${note.isFavorite ? 'text-yellow-400' : 'text-gray-400'} hover:bg-gray-600 transition-colors`}
          title={note.isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
        >
          <svg
            className="w-5 h-5"
            fill={note.isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z"
            />
          </svg>
        </button>
      </div>
      <p className="text-gray-400 mt-2 line-clamp-3">{note.content || 'Без содержимого'}</p>
      {note.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {note.tags.map((tag) => (
            <span key={tag} className="text-sm bg-gray-600 text-gray-200 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="mt-4 flex justify-between">
        <Link href={`/notes/${note.id}`} className="btn text-sm bg-primary hover:brightness-110">
          Подробнее
        </Link>
        <button
          onClick={handleDeleteClick}
          className="btn text-sm bg-red-600 hover:brightness-110"
        >
          Удалить
        </button>
      </div>
    </div>
  );
}
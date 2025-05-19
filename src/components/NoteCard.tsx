import { Note } from '../types/note';
import Link from 'next/link';

type NoteCardProps = {
  note: Note;
  onDelete: (id: string) => void;
};

export default function NoteCard({ note, onDelete }: NoteCardProps) {
  return (
    <div className="card bg-cardBg p-4 rounded-lg shadow-md hover:bg-gray-700 transition-all">
      <h3 className="text-xl font-semibold text-foreground">{note.title}</h3>
      <p className="text-gray-400 mt-2 line-clamp-3">{note.content || 'Без содержимого'}</p>
      <div className="mt-4 flex justify-between">
        <Link href={`/notes/${note.id}`} className="btn text-sm bg-primary hover:brightness-110">
          Подробнее
        </Link>
        <button
          onClick={() => onDelete(note.id)}
          className="btn text-sm bg-red-600 hover:brightness-110"
        >
          Удалить
        </button>
      </div>
    </div>
  );
}
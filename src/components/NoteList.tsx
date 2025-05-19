'use client';
import { Note } from '@/types/note';
import NoteCard from './NoteCard';
import { deleteNote } from '@/actions/noteActions';
import { useRouter } from 'next/navigation';

type NoteListProps = {
  notes: Note[];
};

export default function NoteList({ notes }: NoteListProps) {
  const router = useRouter();

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((note) => (
        <li key={note.id}>
          <NoteCard note={note} onDelete={async (id: string) => {
            await deleteNote(id);
            router.refresh();
          }} />
        </li>
      ))}
    </ul>
  );
}
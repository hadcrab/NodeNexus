'use client';
import { useEffect } from 'react';
import NoteCard from './NoteCard';
import { useNoteStore } from '@/store/useNoteStore';

type NoteListProps = {
  userId: string;
};

export default function NoteList({ userId }: NoteListProps) {
  const { notes, fetchNotes, deleteNote } = useNoteStore();

  useEffect(() => {
    fetchNotes(userId);
  }, [userId, fetchNotes]);

  return notes.length > 0 ? (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((note) => (
        <li key={note.id}>
          <NoteCard
            note={note}
            onDelete={async (id: string) => {
              await deleteNote(id, userId);
            }}
          />
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500 mb-4">Заметок пока нет.</p>
  );
}
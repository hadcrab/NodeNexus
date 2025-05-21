'use client';
import { useEffect, useState } from 'react';
import NoteCard from './NoteCard';
import { useNoteStore } from '@/store/useNoteStore';

type NoteListProps = {
  userId: string;
};

export default function NoteList({ userId }: NoteListProps) {
  const { notes, fetchNotes } = useNoteStore();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'created_at' | 'title' | 'isFavorite'>('created_at');
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    fetchNotes(userId);
  }, [userId, fetchNotes]);

  const allTags = Array.from(new Set(notes.flatMap((note) => note.tags)));

  const filteredNotes = notes
    .filter((note) => {
      const matchesSearch = note.title.toLowerCase().includes(search.toLowerCase()) ||
        (note.content && note.content.toLowerCase().includes(search.toLowerCase()));
      const matchesTag = filterTag ? note.tags.includes(filterTag) : true;
      const matchesFavorite = showFavorites ? note.isFavorite : true;
      return matchesSearch && matchesTag && matchesFavorite;
    })
    .sort((a, b) => {
      if (sortBy === 'created_at') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'isFavorite') {
        return Number(b.isFavorite) - Number(a.isFavorite);
      }
      return 0;
    });

  return (
    <div>
      <div className="mb-4 flex flex-col gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по заметкам..."
          className="input w-full p-2 bg-cardBg text-foreground border border-gray-600 rounded"
        />
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'created_at' | 'title' | 'isFavorite')}
            className="input p-2 bg-cardBg text-foreground border border-gray-600 rounded"
          >
            <option value="created_at">Сортировать по дате</option>
            <option value="title">Сортировать по названию</option>
            <option value="isFavorite">Сортировать по важности</option>
          </select>
          <select
            value={filterTag || ''}
            onChange={(e) => setFilterTag(e.target.value || null)}
            className="input p-2 bg-cardBg text-foreground border border-gray-600 rounded"
          >
            <option value="">Все теги</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={`btn ${showFavorites ? 'bg-yellow-600' : 'bg-gray-600'} hover:brightness-110`}
          >
            {showFavorites ? 'Все заметки' : 'Избранное'}
          </button>
        </div>
      </div>
      {filteredNotes.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <li key={note.id}>
              <NoteCard note={note} userId={userId} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mb-4">Заметок не найдено.</p>
      )}
    </div>
  );
}
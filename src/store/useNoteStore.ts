import { create } from 'zustand';
import { Note } from '@/types/note';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';

type NoteState = {
  notes: Note[];
  fetchNotes: (userId: string) => Promise<void>;
  addNote: (title: string, content: string, userId: string) => Promise<void>;
  deleteNote: (id: string, userId: string) => Promise<void>;
};

export const useNoteStore = create<NoteState>((set) => ({
  notes: [],
  fetchNotes: async (userId: string) => {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
      return;
    }
    set({ notes: data || [] });
  },
  addNote: async (title: string, content: string, userId: string) => {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.from('notes').insert({
      user_id: userId,
      title,
      content,
      relations: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).select();

    if (error) {
      console.error('Error adding note:', error);
      return;
    }
    set((state) => ({ notes: [data[0], ...state.notes] }));
  },
  deleteNote: async (id: string, userId: string) => {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting note:', error);
      return;
    }
    set((state) => ({ notes: state.notes.filter((note) => note.id !== id) }));
  },
}));
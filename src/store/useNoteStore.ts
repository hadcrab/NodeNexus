import { create } from 'zustand';
import { Node, Edge } from 'vis-network/peer';
import { Note, Task } from '@/types/note';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';

type NoteState = {
  notes: Note[];
  fetchNotes: (userId: string) => Promise<void>;
  addNote: (title: string, content: string, userId: string, tags: string[], relations: string[]) => Promise<void>;
  updateNote: (id: string, userId: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string, userId: string) => Promise<void>;
  toggleFavorite: (id: string, userId: string) => Promise<void>;
  addTask: (noteId: string, userId: string, taskText: string) => Promise<void>;
  toggleTask: (noteId: string, userId: string, taskId: string) => Promise<void>;
  getGraphData: (userId: string) => { nodes: Node[]; edges: Edge[] };
  searchNotesByTitle: (userId: string, title: string) => Note[];
};

export const useNoteStore = create<NoteState>((set) => ({
  notes: [],
  fetchNotes: async (userId: string) => {
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notes:', error);
        throw new Error('Failed to fetch notes');
      }

      console.log('Fetched notes:', data);
      set({ notes: data || [] });
    } catch (err) {
      console.error('Error in fetchNotes:', err);
      throw err;
    }
  },
  addNote: async (title: string, content: string, userId: string, tags: string[], relations: string[] = []) => {
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.from('notes').insert({
        user_id: userId,
        title,
        content,
        tags,
        is_favorite: false,
        tasks: [],
        relations,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).select();

      if (error) {
        console.error('Error adding note:', error);
        throw new Error('Failed to add note');
      }

      console.log('Added note with relations:', data[0]);
      set((state) => ({ notes: [data[0], ...state.notes] }));
    } catch (err) {
      console.error('Error in addNote:', err);
      throw err;
    }
  },
  updateNote: async (id: string, userId: string, updates: Partial<Note>) => {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase
      .from('notes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)
      .select();

    if (error) {
      console.error('Error updating note:', error);
      return;
    }
    set((state) => ({
      notes: state.notes.map((note) => (note.id === id ? data[0] : note)),
    }));
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
  toggleFavorite: async (id: string, userId: string) => {
    const supabase = createSupabaseBrowserClient();
    const { data: note, error: fetchError } = await supabase
      .from('notes')
      .select('is_favorite')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (fetchError || !note) {
      console.error('Error fetching note for toggling favorite:', fetchError);
      return;
    }

    const newFavoriteStatus = !note.is_favorite;
    const { data, error } = await supabase
      .from('notes')
      .update({ is_favorite: newFavoriteStatus, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)
      .select();

    if (error) {
      console.error('Error toggling favorite:', error);
      return;
    }

    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id ? { ...n, isFavorite: newFavoriteStatus } : n
      ),
    }));
  },
  addTask: async (noteId: string, userId: string, taskText: string) => {
    const supabase = createSupabaseBrowserClient();
    const note = (await supabase.from('notes').select('tasks').eq('id', noteId).eq('user_id', userId).single()).data;
    if (!note) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      text: taskText,
      completed: false,
    };
    const updatedTasks = [...note.tasks, newTask];

    const { data, error } = await supabase
      .from('notes')
      .update({ tasks: updatedTasks, updated_at: new Date().toISOString() })
      .eq('id', noteId)
      .eq('user_id', userId)
      .select();

    if (error) {
      console.error('Error adding task:', error);
      return;
    }
    set((state) => ({
      notes: state.notes.map((note) => (note.id === noteId ? data[0] : note)),
    }));
  },
  toggleTask: async (noteId: string, userId: string, taskId: string) => {
    const supabase = createSupabaseBrowserClient();
    const note = (await supabase.from('notes').select('tasks').eq('id', noteId).eq('user_id', userId).single()).data;
    if (!note) return;

    const updatedTasks = note.tasks.map((task: Task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );

    const { data, error } = await supabase
      .from('notes')
      .update({ tasks: updatedTasks, updated_at: new Date().toISOString() })
      .eq('id', noteId)
      .eq('user_id', userId)
      .select();

    if (error) {
      console.error('Error toggling task:', error);
      return;
    }
    set((state) => ({
      notes: state.notes.map((note) => (note.id === noteId ? data[0] : note)),
    }));
  },
  getGraphData: (userId: string) => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const notesForUser = useNoteStore.getState().notes.filter((note) => note.user_id === userId);

    console.log('Notes for graph:', notesForUser);
    console.log('Relations for each note:', notesForUser.map((note) => ({ id: note.id, relations: note.relations })));

    notesForUser.forEach((note) => {
      nodes.push({ id: note.id, label: note.title, shape: 'circle' });
    });

    notesForUser.forEach((note) => {
      note.relations.forEach((relatedId) => {
        if (notesForUser.find((n) => n.id === relatedId)) {
          edges.push({ from: relatedId, to: note.id });
        }
      });
    });

    nodes.forEach((node) => {
      const outgoingEdges = edges.filter((edge) => edge.from === node.id);
      node.size = outgoingEdges.length > 0 ? 30 : 15;
    });

    console.log('Nodes:', nodes);
    console.log('Edges:', edges);

    return { nodes, edges };
  },
  searchNotesByTitle: (userId: string, title: string): Note[] => {
    const notesForUser = useNoteStore.getState().notes.filter((note) => note.user_id === userId);
    return notesForUser.filter((note) =>
      note.title.toLowerCase().includes(title.toLowerCase())
    );
  },
}));
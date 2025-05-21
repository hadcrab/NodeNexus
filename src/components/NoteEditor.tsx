'use client';
import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { useNoteStore } from '@/store/useNoteStore';
import { Task } from '@/types/note';

type NoteEditorProps = {
  note?: { id: string; title: string; content: string | null; tags: string[]; tasks: Task[] };
  userId?: string;
  onSave: () => void;
  onCancel: () => void;
};

export default function NoteEditor({ note, userId, onSave, onCancel }: NoteEditorProps) {
  const supabase = createSupabaseBrowserClient();
  const { addNote, updateNote, addTask, toggleTask } = useNoteStore();
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [tasks, setTasks] = useState<Task[]>(note?.tasks || []);
  const [newTask, setNewTask] = useState('');

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleAddTask = async () => {
    if (newTask && userId && note) {
      await addTask(note.id, userId, newTask);
      setTasks([...tasks, { id: crypto.randomUUID(), text: newTask, completed: false }]);
      setNewTask('');
    } else if (newTask) {
      const task: Task = { id: crypto.randomUUID(), text: newTask, completed: false };
      setTasks([...tasks, task]);
      setNewTask('');
    }
  };

  const handleToggleTask = async (taskId: string) => {
    if (userId && note) {
      await toggleTask(note.id, userId, taskId);
    }
    setTasks(tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleSave = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    if (note && userId) {
      await updateNote(note.id, userId, { title, content, tags, tasks });
    } else {
      await addNote(title, content, user.id, tags);
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
      <div className="mt-4">
        <h4 className="text-foreground font-semibold">Теги</h4>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Добавить тег..."
            className="input w-full p-2 bg-cardBg text-foreground border border-gray-600 rounded"
          />
          <button onClick={handleAddTag} className="btn bg-primary hover:brightness-110">
            +
          </button>
        </div>
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span key={tag} className="flex items-center bg-gray-600 text-gray-200 px-2 py-1 rounded">
              {tag}
              <button onClick={() => handleRemoveTag(tag)} className="ml-1 text-red-400">×</button>
            </span>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <h4 className="text-foreground font-semibold">Список задач</h4>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Добавить задачу..."
            className="input w-full p-2 bg-cardBg text-foreground border border-gray-600 rounded"
          />
          <button onClick={handleAddTask} className="btn bg-primary hover:brightness-110">
            +
          </button>
        </div>
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleTask(task.id)}
                className="h-4 w-4"
              />
              <span className={task.completed ? 'line-through text-gray-400' : 'text-foreground'}>
                {task.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
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
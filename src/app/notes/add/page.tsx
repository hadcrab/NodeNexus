'use client';

import { useRouter } from 'next/navigation';
import NoteEditor from '@/components/NoteEditor';

export default function AddNotePage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Добавить заметку</h1>
      <NoteEditor
        onSave={() => router.push('/')}
        onCancel={() => router.push('/')} 
      />
    </div>
  );
}
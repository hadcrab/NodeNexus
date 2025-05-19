'use server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export async function deleteNote(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    await supabase.from('notes').delete().eq('id', id).eq('user_id', user.id);
  }
}
'use client';

import { createSupabaseBrowserClient } from '@/lib/supabaseClient';

export default function LogoutButton() {
  const supabase = createSupabaseBrowserClient();

  return (
    <button
      className="btn btn-outline mt-4"
      onClick={async () => {
        await supabase.auth.signOut();
        window.location.reload();
      }}
    >
      Выйти
    </button>
  );
}
'use client';
import { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network/peer';
import { useNoteStore } from '@/store/useNoteStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function GraphPage() {
  const networkRef = useRef<HTMLDivElement>(null);
  const { fetchNotes, getGraphData } = useNoteStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUserAndInitGraph = async () => {
      try {
        const supabase = (await import('@/lib/supabaseClient')).createSupabaseBrowserClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error('Error fetching user:', userError);
          if (isMounted) {
            setError('Ошибка при получении пользователя. Попробуйте войти заново.');
            setIsLoading(false);
            router.push('/auth');
          }
          return;
        }

        if (!user) {
          console.warn('No user found, redirecting to auth');
          if (isMounted) {
            router.push('/auth');
            setIsLoading(false);
          }
          return;
        }

        console.log('User fetched:', user.id);

        await fetchNotes(user.id);
        console.log('Notes fetched');

        if (isMounted) setIsLoading(false);
      } catch (err) {
        console.error('Error in fetchUserAndInitGraph:', err);
        if (isMounted) {
          setError('Произошла ошибка при загрузке данных. Попробуйте обновить страницу.');
          setIsLoading(false);
        }
      }
    };

    fetchUserAndInitGraph();

    return () => {
      isMounted = false;
    };
  }, [router]);

  useEffect(() => {
    if (!networkRef.current || isLoading || error) return;

    const { nodes, edges } = getGraphData(useNoteStore.getState().notes[0]?.user_id || '');
    console.log('Graph data:', { nodes, edges });

    if (nodes.length === 0) {
      setError('Нет заметок для отображения. Добавьте заметки, чтобы увидеть граф.');
      return;
    }

    if (edges.length === 0) {
      setError('Нет связей между заметками. Добавьте связи в редакторе заметок.');
      return;
    }

    const data = {
      nodes: nodes,
      edges: edges,
    };

    const options = {
      nodes: {
        shape: 'circle',
        color: {
          background: '#4B5563',
          border: '#9CA3AF',
          highlight: {
            background: '#F59E0B',
            border: '#FCD34D',
          },
        },
        font: {
          color: '#E5E7EB',
        },
      },
      edges: {
        color: '#9CA3AF',
        arrows: 'to', 
      },
      physics: {
        enabled: true,
        solver: 'forceAtlas2Based',
      },
    };

    const network = new Network(networkRef.current, data, options);
    console.log('Network initialized');

    return () => {
      network.destroy();
    };
  }, [isLoading, error, getGraphData]);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-4xl font-extrabold text-center mb-3 text-foreground">Граф заметок</h1>
      {isLoading ? (
        <p className="text-center text-gray-400">Загрузка...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div ref={networkRef} style={{ height: '600px', width: '100%' }} />
      )}
      <div className="mt-4 text-center">
      </div>
    </div>
  );
}
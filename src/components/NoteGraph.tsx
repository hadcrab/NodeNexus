import { useEffect, useRef } from 'react';
import { Network } from 'vis-network/peer';
import { useNoteStore } from '@/store/useNoteStore';

type NoteGraphProps = {
  userId: string;
};

export default function NoteGraph({ userId }: NoteGraphProps) {
  const networkRef = useRef<HTMLDivElement>(null);
  const { getGraphData } = useNoteStore();

  useEffect(() => {
    if (!networkRef.current) return;

    const { nodes, edges } = getGraphData(userId);

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

    return () => {
      network.destroy();
    };
  }, [userId, getGraphData]);

  return <div ref={networkRef} style={{ height: '400px', width: '100%' }} />;
}
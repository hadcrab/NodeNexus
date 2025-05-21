export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  tags: string[];
  isFavorite: boolean;
  tasks: Task[];
  relations: string[];
  created_at: string;
  updated_at: string;
}
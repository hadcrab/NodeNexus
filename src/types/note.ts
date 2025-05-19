export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  relations: string[];
  created_at: string;
  updated_at: string;
}
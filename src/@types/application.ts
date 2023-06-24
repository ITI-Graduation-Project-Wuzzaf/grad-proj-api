export interface IApplication {
  id: number;
  user_id: number;
  job_id: number;
  status: 'submitted' | 'rejected' | 'in-consideration';
  cv: string;
  cover_letter: string;
  additional_info: string;
  created_at: string;
  updated_at: string;
}

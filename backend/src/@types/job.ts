export interface IJob {
  id: number;
  title: string;
  description: string;
  type: 'Part-time' | 'Full-time';
  location: string;
  min_salary: number;
  max_salary: number;
  experience: string;
  skills: string[];
  empoloer_id: number;
  created_at: string;
}

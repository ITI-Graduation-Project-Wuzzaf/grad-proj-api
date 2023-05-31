export interface IJob {
  id: number;
  title: string;
  description: string;
  type: 'Part-time' | 'Full-time';
  location: string;
  category: string;
  min_salary: number;
  max_salary: number;
  experience: string;
  skills: string[];
  featured: boolean;
  employer_id: number;
  created_at: string;
}

export interface IProfile {
  id: number;
  country: string;
  city: string;
  job: string;
  gender: 'M' | 'F';
  experience_level: string;
  links: string[];
  profile_picture: string;
  cv: string;
  bio: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

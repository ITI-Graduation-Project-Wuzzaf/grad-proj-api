export interface IProfile {
  id: number;
  country: string;
  city: string;
  job: string;
  gender: 'M' | 'F';
  experience_level: string;
  links: string[];
  portfolio: string;
  profile_picture: string;
  cv: string;
  bio: string;
  university: string;
  created_at: string;
  updated_at: string;
}

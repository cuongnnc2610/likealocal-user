import { Language } from './language';

export class UsersLanguage {
  user_id: number;
  language_id: number;
  is_deleted: boolean;
  createdAt: string;  
  updatedAt: string;
  language: Language = new Language();
}

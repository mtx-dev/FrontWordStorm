import { QuizNameType } from '../hoocks/useQuizes';

export interface ISettings {
  voice: string | null;
  allowVioce: boolean;
  allowedQuizes: string[];
  quizes: QuizNameType[];
}

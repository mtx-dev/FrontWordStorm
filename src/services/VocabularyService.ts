import api from '../http';
import { AxiosResponse } from 'axios';
import { IWord } from '../models/IWord';

const words: IWord[] = [
  {
    id: '1',
    word: 'mention',
    translation: 'упомянуть',
    status: 'study',
    lastSuccessful: null,
    attempts: 0,
    successfulAttempts: 0,
    active: true,
  },
  {
    id: '2',
    word: 'embed',
    translation: 'встроить',
    status: 'study',
    lastSuccessful: null,
    attempts: 0,
    successfulAttempts: 0,
    active: true,
  },
  {
    id: '3',
    word: 'participate',
    translation: 'учавствовать',
    status: 'study',
    lastSuccessful: null,
    attempts: 0,
    successfulAttempts: 0,
    active: true,
  },
  {
    id: '4',
    word: 'refuse',
    translation: 'отказ',
    status: 'study',
    lastSuccessful: null,
    attempts: 0,
    successfulAttempts: 0,
    active: true,
  },
  {
    id: '5',
    word: 'climb',
    translation: 'взбираться',
    status: 'study',
    lastSuccessful: null,
    attempts: 0,
    successfulAttempts: 0,
    active: true,
  },
  {
    id: '6',
    word: 'occupation',
    translation: 'род деятельности',
    status: 'study',
    lastSuccessful: null,
    attempts: 0,
    successfulAttempts: 0,
    active: true,
  },
  {
    id: '7',
    word: 'stuff',
    translation: 'вещи',
    status: 'study',
    lastSuccessful: null,
    attempts: 0,
    successfulAttempts: 0,
    active: true,
  },
  {
    id: '8',
    word: 'staff',
    translation: 'персонал',
    status: 'study',
    lastSuccessful: null,
    attempts: 0,
    successfulAttempts: 0,
    active: true,
  },
  {
    id: '9',
    word: 'particularly',
    translation: 'в особености',
    status: 'study',
    lastSuccessful: null,
    attempts: 0,
    successfulAttempts: 0,
    active: true,
  },
  {
    id: '10',
    word: 'occur',
    translation: 'случаться',
    status: 'study',
    lastSuccessful: null,
    attempts: 0,
    successfulAttempts: 0,
    active: true,
  },
  {
    id: '11',
    word: 'held',
    translation: 'проводится',
    status: 'study',
    lastSuccessful: null,
    attempts: 0,
    successfulAttempts: 0,
    active: true,
  },
  {
    id: '12',
    word: 'deceive',
    translation: 'обманывать',
    status: 'study',
    lastSuccessful: null,
    attempts: 0,
    successfulAttempts: 0,
    active: true,
  },
  {
    id: '13',
    word: 'abolish',
    translation: 'отменять',
    status: 'study',
    lastSuccessful: null,
    attempts: 0,
    successfulAttempts: 0,
    active: true,
  },
  {
    id: '14',
    word: 'accuse',
    translation: 'обвинять',
    status: 'study',
    lastSuccessful: null,
    attempts: 0,
    successfulAttempts: 0,
    active: true,
  },
  {
    id: '15',
    word: 'inflate',
    translation: 'раздувать',
    status: 'study',
    lastSuccessful: null,
    attempts: 0,
    successfulAttempts: 0,
    active: true,
  },
  {
    id: '16',
    word: 'revise',
    translation: 'повторять',
    status: 'study',
    lastSuccessful: null,
    attempts: 0,
    successfulAttempts: 0,
    active: true,
  },
  {
    id: '17',
    word: 'hesitate',
    translation: 'колебаться',
    status: 'study',
    lastSuccessful: null,
    attempts: 0,
    successfulAttempts: 0,
    active: true,
  },
  {
    id: '18',
    word: 'tempt',
    translation: 'искушать',
    status: 'study',
    lastSuccessful: null,
    attempts: 0,
    successfulAttempts: 0,
    active: true,
  },
  {
    id: '19',
    word: 'satisfy',
    translation: 'удовлетворять',
    status: 'study',
    lastSuccessful: null,
    attempts: 0,
    successfulAttempts: 0,
    active: true,
  },
  {
    id: '20',
    word: 'prevent',
    translation: 'предотвращать',
    status: 'study',
    lastSuccessful: null,
    attempts: 0,
    successfulAttempts: 0,
    active: true,
  },
  {
    id: '21',
    word: 'avoid',
    translation: 'избегать',
    status: 'study',
    lastSuccessful: null,
    attempts: 0,
    successfulAttempts: 0,
    active: true,
  },
  {
    id: '22',
    word: 'preserve',
    translation: 'сохранять',
    status: 'study',
    lastSuccessful: null,
    attempts: 0,
    successfulAttempts: 0,
    active: true,
  },
  {
    id: '23',
    word: 'intend',
    translation: 'намереваться',
    status: 'study',
    lastSuccessful: null,
    attempts: 0,
    successfulAttempts: 0,
    active: true,
  },
];

export default class VocabularyService {
  // static async getVocabulary(): Promise<any> {
  //   return { data: words };
  // }
  static async getVocabulary(): Promise<AxiosResponse<IWord[]>> {
    return api.get<IWord[]>('/vocabulary');
  }

  static async addWord(
    word: string,
    translation: string,
  ): Promise<AxiosResponse<IWord>> {
    return api.post<IWord>('/vocabulary', { word, translation });
  }

  static async deleteWord(id: string): Promise<AxiosResponse<IWord>> {
    return api.delete<IWord, AxiosResponse<IWord>>('/vocabulary', {
      id,
    } as any);
  }

  static async updateWord(word: Partial<IWord>): Promise<AxiosResponse<IWord>> {
    return api.patch<IWord>('/vocabulary/update', { word });
  }

  static async updateWords(words: Partial<IWord>[]): Promise<AxiosResponse> {
    return api.patch('/vocabulary/updates', { words });
  }
}

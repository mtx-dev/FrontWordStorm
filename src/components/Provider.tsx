import React, { useState } from 'react';
import useAsyncEffect from '../hoocks/useAsyncEffect';
import AuthService from '../services/AuthServoce';
import { Context } from '../context/Context';
import { IUser } from '../models/IUser';
import { IWord } from '../models/IWord';
import { StoreContextType } from '../context/Context';
import VocabularyServoce from '../services/VocabularyService';
import { useErrorHandling } from '../hoocks/useErrorHandling';

export default function Provider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser>(null);
  const [vocabulary, setVocabulary] = useState<IWord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isAuthChecked, setIsAuthChecked] = useState<boolean>(false);
  const { triggerError } = useErrorHandling();

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      // TODO Add error connection
      const response = await AuthService.refresh();
      console.log('refresh', response);
      localStorage.setItem('token', response.data.accessToken);
      setUser({ ...response.data.user });
      await getVocabulary();
      setIsAuth(true);
    } catch (error: any) {
      console.log('checkAuth', error.response?.data?.message);
      triggerError(error);
    }
    setIsLoading(false);
    setIsAuthChecked(true);
  };

  const login = async (
    email: string,
    password: string,
    callback = () => {},
  ) => {
    try {
      // TODO Add error connection
      const response = await AuthService.login(email, password);
      localStorage.setItem('token', response.data.accessToken);
      console.log('set user', response.data.user);
      setUser({ ...response.data.user });
      await getVocabulary();
      setIsAuth(true);
      callback();
    } catch (error: any) {
      console.log(error.response?.data?.message);
      triggerError(error);
    }
  };

  const registration = async (
    email: string,
    password: string,
    callback = () => {},
  ) => {
    try {
      // TODO Add error connection
      const response = await AuthService.registration(email, password);
      localStorage.setItem('token', response.data.accessToken);
      setIsAuth(true);
      setUser(response.data.user);
      callback();
    } catch (error: any) {
      console.log(error.response?.data?.message);
      triggerError(error);
    }
  };

  const logout = async (callback = () => {}) => {
    try {
      // TODO Add error connection
      await AuthService.logout();
      localStorage.removeItem('token');
      setIsAuth(false);
      setUser({} as IUser);
      setVocabulary([]);
      callback();
    } catch (error: any) {
      console.log(error.response?.data?.message);
      triggerError(error);
    }
  };

  useAsyncEffect(async () => {
    if (localStorage.getItem('token')) await checkAuth();
  }, []);

  const saveStatistic = async (wordsStatistic: Partial<IWord>[]) => {
    const r = await VocabularyServoce.updateWords(wordsStatistic);
    console.log(r);
  };
  // TODO move to utils
  const sortVocabulary = (voc: IWord[]) => {
    const sorted = [...voc];
    return sorted.sort((a, b) => {
      if (a.active && b.active) return 0;
      if ((a.active && !b.active) || b.status === 'learned') return -1;
      return 1;
    });
  };

  const getVocabulary = async () => {
    try {
      const response = await VocabularyServoce.getVocabulary();
      console.log('Get voc', response.data);
      setVocabulary(sortVocabulary(response.data));
    } catch (error: any) {
      console.log(error.response?.data?.message);
      triggerError(error);
    }
  };

  const addWord = async (word: string, translation: string) => {
    try {
      const response = await VocabularyServoce.addWord(word, translation);
      console.log('new', response.data);
      const newVocabulary = [...vocabulary, response.data];
      setVocabulary(newVocabulary);
    } catch (error: any) {
      console.log(error.response?.data?.message);
      triggerError(error);
    }
  };

  const setWordActive = async (id: IWord['id'], active: boolean) => {
    try {
      const newVocabulary = [...vocabulary];
      const wordIndex = newVocabulary.findIndex((item) => item.id === id);
      newVocabulary[wordIndex].active = active;
      await VocabularyServoce.updateWord({ id, active });

      setVocabulary(newVocabulary);
    } catch (error: any) {
      console.log(error.response?.data?.message);
      triggerError(error);
    }
  };

  const setVoice = (voiceIndex: string) => {
    if (!user) return;
    const updateUser = { ...user };
    updateUser.settings.voice = voiceIndex;
    console.log('set voiceIndex', voiceIndex);
    setUser(updateUser);
  };

  const value: StoreContextType = {
    isLoading,
    isAuth,
    isAuthChecked,
    user,
    login,
    logout,
    registration,
    vocabulary,
    saveStatistic,
    getVocabulary,
    addWord,
    setWordActive,
    setVoice,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

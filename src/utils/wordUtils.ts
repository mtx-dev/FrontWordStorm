import { IWord } from '../models/IWord';
import { limits } from '../constants';
import { skipedChars, maxQuizWords } from '../constants';
import { shuffle } from './shuffle';

const milisecondsOfDay = 1000 * 60 * 60 * 24;

export const splitByWords = (str: string): string[] => {
  const skippedCharsWithoutSpace = skipedChars.filter((c) => c !== ' ');
  const reg = new RegExp(`[${skippedCharsWithoutSpace.join('')}]`, 'g');
  const clearStr = str.replace(reg, '').replace(/\s\s+/g, ' ');
  return clearStr.split(' ');
};

export function filterToStudy(vocabulary: IWord[]): IWord[] {
  const counters: number[] = [0, 0, 0, 0, 0];
  const currentDate = new Date();
  // console.log('vocabulary', vocabulary);

  const allows: IWord[] = vocabulary.filter((w) => {
    if (!w.active || w.status === 'learned') return false;
    return true;
  });
  // console.log('allows', allows);

  const actuals = allows.filter((w) => {
    const lastSuccessful = w.lastSuccessful
      ? new Date(w.lastSuccessful)
      : currentDate;
    const daysPassed = Math.abs(
      Math.round(
        (currentDate.getTime() - lastSuccessful.getTime()) / milisecondsOfDay +
          0.2,
      ),
    );
    switch (w.successfulAttempts) {
      case 1:
        return daysPassed >= 1;
      case 2:
        return daysPassed >= 6;
      case 3:
        return daysPassed >= 25;
      default:
        return false;
    }
  });
  // console.log('actuals', actuals);

  const resultWords = shuffle(actuals).reduce((limitedWords, w) => {
    if (counters[w.successfulAttempts] >= limits[w.successfulAttempts]) {
      return limitedWords;
    }
    counters[w.successfulAttempts] = counters[w.successfulAttempts] + 1;
    limitedWords.push(w);
    return limitedWords;
  }, []);
  // console.log('resultWords', resultWords.length);

  const additionNewWords = allows
    .filter((w) => w.successfulAttempts === 0)
    .slice(0, maxQuizWords - resultWords.length);
  // console.log('additionNewWords', additionNewWords);

  resultWords.push(...additionNewWords);
  // console.log('resultWords2', resultWords);

  return resultWords;
}

const maxFakeWords = 5;
const maxFakeLength = 10;

const random = (max: number) => Math.floor(Math.random() * max);
const randomRange = (min: number, max: number) => min + random(max - min);
// const getRandomWords = (arr, max) => {};

// const getRandomWordsByLength = (length, arr, max) => {
//   const amountWords = arr.length;
//   const maxAttempt = Math.max(Math.floor(amountWords / length), 300);
//   const result = [];
//   for (let i = 0; i < maxAttempt; i++) {
//     const index = random(amountWords);
//     if (arr[index].word.length === length) {
//       result.push(arr[index].word);
//     }
//     if (result.length >= max) break;
//   }
//   console.log(result);
//   return result;
// };

// function getFakeWords(rightWord: string, dic: any) {
//   const lessFlag = rightWord.length >= maxFakeLength;
//   const temps = [];
//   let currentLength = rightWord.length;

//   while (temps.length < maxFakeWords) {
//     temps.push(...getRandomWordsByLength(currentLength, dic, maxFakeWords));
//     currentLength = lessFlag ? currentLength - 1 : currentLength + 1;
//     if (currentLength < 2 && lessFlag) break;
//     if (currentLength > 20) break;
//   }
//   console.log('result fake words', temps);
//   return temps;
// }

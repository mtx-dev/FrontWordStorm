import React, { useEffect, useState } from 'react';
import useAsyncEffect from '../../hoocks/useAsyncEffect';
import QuizCard from '../../common/layout/quizCard/QuizCard';

import { randomIndex } from '../../utils/random';
import { IQuizProps } from '../../models/IQuiz';
import WordsList from '../../common/layout/wordList/WordsList';
import WordsListItem from '../../common/layout/wordList/WordsListItem';
import Spinner from '../../common/Spinner';
import DictionaryServoce from '../../services/DictionaryServoce';

import { MAX_WORDS_VARIANTS } from '../../constants';

export default function QuizReverseTranslate({
  pazzleWord,
  next,
}: IQuizProps): JSX.Element {
  const [pazzleList, setPazzleList] = useState<string[]>([]);
  const [choosenWord, setChoosenWord] = useState('');
  const [allowNext, setAllowNext] = useState<boolean>(false);
  const [isAnswerRight, setIsAnswerRight] = useState<boolean>(true);

  useEffect(() => {
    if (pazzleWord.translation === choosenWord) {
      setAllowNext(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choosenWord]);

  useAsyncEffect(async () => {
    // TODO rework to just words array
    const fakeWords = await DictionaryServoce.getFakeTranslationWords(
      pazzleWord.translation,
    );
    const resultList = [...fakeWords.map((item) => item.word)];
    const rightAnswerIndex = randomIndex(MAX_WORDS_VARIANTS - 1);
    resultList.splice(rightAnswerIndex, 0, pazzleWord.translation);
    setPazzleList(resultList);
  }, [pazzleWord.word]);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLButtonElement;
    const choosen = target.dataset.value;
    if (choosen) {
      setChoosenWord(choosen);
      if (isAnswerRight) {
        setIsAnswerRight(pazzleWord.translation === choosen);
      }
    }
  };

  const handleNextWord = () => {
    // setPazzleList([]);
    next(isAnswerRight);
  };

  const buldList = pazzleList.map((item, index) => (
    <WordsListItem
      key={index}
      text={item}
      isRight={item === pazzleWord.translation}
      checked={item === choosenWord}
    />
  ));

  return (
    <QuizCard
      title="Translate to Russian"
      pazzle={pazzleWord.word}
      disabledNext={!allowNext}
      handleNextWord={handleNextWord}
    >
      {buldList.length ? (
        <WordsList onClick={handleClick}>{buldList}</WordsList>
      ) : (
        <Spinner />
      )}
    </QuizCard>
  );
}

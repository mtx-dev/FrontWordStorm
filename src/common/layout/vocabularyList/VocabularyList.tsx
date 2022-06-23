import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { IWord } from '../../../models/IWord';
import VocabularyItem from './VocabularyItem';

export default function VocabularyList({
  wordsList,
  onChangeActive,
}: {
  wordsList: IWord[];
  onChangeActive: (id: IWord['id'], active: boolean) => void;
}) {
  // TODO Rework sort on some contition
  const sorted = wordsList.sort((a, b) => {
    if (a.active && b.active) return 0;
    if (a.active && !b.active) return -1;
    return 1;
  });
  const buildList = sorted.map((wordItem) => {
    return (
      <VocabularyItem
        key={wordItem.word}
        wordItem={wordItem}
        onChangeActive={onChangeActive}
      />
    );
  });
  return <ListGroup>{buildList}</ListGroup>;
}

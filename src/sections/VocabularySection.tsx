import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Container,
  Form,
  FormControl,
  Button,
  Collapse,
  InputGroup,
} from 'react-bootstrap';
import VocabularyList from '../common/layout/vocabularyList/VocabularyList';
import useVocabulary from '../hoocks/useVocabulary';
import { PlusLg, XLg } from 'react-bootstrap-icons';
import useDebounce from '../hoocks/useDebounce';
import { IWord } from '../models/IWord';
import { IDictionaryWord } from '../models/IDictionaryWord';
import useAsyncEffect from '../hoocks/useAsyncEffect';
import DictionaryServoce from '../services/DictionaryServoce';
import DictionaryList from '../common/layout/dictionaryList/DictionaryList';
import Spinner from '../common/Spinner';

export default function VocabularySection() {
  const { vocabulary, addWord, setWordActive } = useVocabulary();
  const [isAddMode, setIsAddMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [translation, setTranslation] = useState('');
  const [note, setNote] = useState('');
  const [isChoosen, setIsChoosen] = useState(false);
  const studyingVocabulary = useMemo(() => {
    return vocabulary.filter((w) => w.status !== 'learned');
  }, [vocabulary]);
  const [filteredVocabularyList, setFilteredVocabularyList] =
    useState<IWord[]>(studyingVocabulary);
  const [filteredDictionaryList, setFilteredDictionaryList] = useState<
    IDictionaryWord[]
  >([]);

  const filterBySearch = useCallback(
    (str: string) => {
      const filtered = !str
        ? studyingVocabulary
        : studyingVocabulary.filter((item) => item.word.includes(str));

      setFilteredVocabularyList(filtered);
    },
    [studyingVocabulary],
  );

  const handleChangeSearch = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    const searchInput = target.value.toLocaleLowerCase();
    const pattern = /^([^0-9]*)$/g;
    if (!searchInput.match(pattern)) return;
    setSearch(searchInput);
  };

  const handleChangeTranslation = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    const searchInput = target.value;
    setTranslation(searchInput);
  };

  const handleChangeNote = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    setNote(target.value);
  };

  const handleDictionaryChoice = (id: IWord['id']) => {
    const choosed = filteredDictionaryList.find((item) => item.id === id);
    setTranslation(choosed.translations[0]);
  };

  const handleAddToggle = useCallback(() => {
    setIsAddMode(!isAddMode);
  }, [isAddMode]);

  const handleAddButton = useCallback(() => {
    setIsChoosen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAddMode]);

  const dictionarySearch = async (str: string) => {
    setIsLoading(true);
    const response = await DictionaryServoce.search(str);
    // TODO Add error when no data;
    setFilteredDictionaryList(response.data);
    setIsLoading(false);
  };
  const debouncedDictionarySearch = useDebounce(dictionarySearch, 400);

  useEffect(() => {
    filterBySearch(search.trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studyingVocabulary, search]);

  useAsyncEffect(async () => {
    if (!search || !isAddMode) return;
    debouncedDictionarySearch(search.trim());
  }, [search, isAddMode]);

  useAsyncEffect(async () => {
    if (!search || !isAddMode || !isChoosen) return;
    setIsLoading(true);
    await addWord(search.trim().toLocaleLowerCase(), translation, note);
    setIsLoading(false);
    setIsChoosen(false);
    setTranslation('');
    setNote('');
    setSearch('');
    setIsAddMode(false);
    setFilteredDictionaryList([]);
  }, [search, isAddMode, isChoosen]);

  const onChangeActive = (id: IWord['id'], active: boolean) => {
    setWordActive(id, active);
  };

  const renderList = () => {
    return isAddMode ? (
      <DictionaryList
        dicList={filteredDictionaryList}
        onClick={handleDictionaryChoice}
      />
    ) : (
      <VocabularyList
        wordsList={filteredVocabularyList}
        onChangeActive={onChangeActive}
      />
    );
  };

  return (
    <Container className="container-sm p-2">
      <Form className="m-3">
        <InputGroup className="mb-3">
          <FormControl
            type="search"
            placeholder="Search"
            className="me-2"
            aria-label="Search"
            onChange={handleChangeSearch}
            value={search}
          />
          <Button
            variant="outline-light"
            disabled={isLoading}
            onClick={handleAddToggle}
          >
            {isAddMode ? (
              <XLg color="royalblue" size={32} />
            ) : (
              <PlusLg color="royalblue" size={32} />
            )}
          </Button>
        </InputGroup>
        <Collapse in={isAddMode}>
          <div>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Your translation"
                aria-label="Your translation"
                aria-describedby="basic-addon2"
                value={translation}
                onChange={handleChangeTranslation}
              />
              <FormControl
                placeholder="Addition note"
                aria-label="Addition note"
                aria-describedby="basic-addon2"
                value={note}
                onChange={handleChangeNote}
              />
              <Button
                variant="primary"
                className="px-4"
                disabled={isLoading || !translation || !search}
                onClick={handleAddButton}
              >
                Add
              </Button>
            </InputGroup>
          </div>
        </Collapse>
      </Form>
      {isLoading ? <Spinner /> : renderList()}
    </Container>
  );
}

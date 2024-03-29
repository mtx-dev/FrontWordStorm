import React, { useState, FormEvent, useRef, useEffect } from 'react';
import QuizCard from '../../common/layout/quizCard/QuizCard';
import {
  Button,
  Row,
  Form,
  Card,
  FormControl,
  InputGroup,
} from 'react-bootstrap';
import { ArrowRight } from 'react-bootstrap-icons';
import useAsyncEffect from '../../hoocks/useAsyncEffect';
import { IQuizProps } from '../../models/IQuiz';
import { splitByWords } from '../../utils/wordUtils';
import useSettings from '../../hoocks/useSettings';
import { sortVoices } from '../../utils/sortVoices';

enum Playback {
  Pending = 'Pending',
  Play = 'Play',
  Pause = 'Pause',
  Resume = 'Resume',
}

// rework add event
// eslint-disable-next-line no-undef
const getVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    window.speechSynthesis.onvoiceschanged = (_e) => {
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.getVoices();
  });
};
export interface ISpeechConfig {
  lang: string;
  volume?: number;
  rate?: number;
  pitch?: number;
}

const config = {} as ISpeechConfig;
config.lang = 'en-GB';
config.rate = 1;
config.pitch = 1;
config.volume = 1;

const defaultSpeech = (config: ISpeechConfig): SpeechSynthesisUtterance => {
  const s0 = new SpeechSynthesisUtterance();
  s0.volume = config.volume;
  s0.rate = config.rate;
  s0.pitch = config.pitch;
  return s0;
};

export default function QuizListen({
  pazzleWord,
  next,
}: IQuizProps): JSX.Element {
  const inputClasses = ['text-light', 'bg-dark', 'border'];
  const { settings } = useSettings();
  const wordForm = useRef<HTMLFormElement>();
  const [playback, setPlaybak] = useState<Playback>(Playback.Play);
  const [hasVoice, setHasVioce] = useState<boolean>(false);
  const [allowNext, setAllowNext] = useState<boolean>(false);
  const [isFirstAnswerRight, setIsFirstAnswerRight] = useState<boolean>(false);
  const [isAnswerRight, setIsAnswerRight] = useState<boolean>(true);
  // eslint-disable-next-line no-undef
  const [voice, setVoice] = useState<SpeechSynthesisVoice>();

  const onEnd = () => setPlaybak(Playback.Play);
  const speechSynth = window.speechSynthesis;
  const speech = defaultSpeech(config);
  speech.text = pazzleWord.word;
  speech.voice = voice;
  speech.onend = onEnd;

  const splitedPazzle = splitByWords(pazzleWord.word);
  inputClasses.push(
    !allowNext
      ? 'border-secondary'
      : isAnswerRight
      ? 'border-info border-3'
      : 'border-danger border-3',
  );

  useAsyncEffect(async () => {
    const voicesTry = speechSynth.getVoices();
    const voices = voicesTry.length ? voicesTry : await getVoices();
    const sortedVoices = sortVoices(voices);
    const voice = sortedVoices[Number(settings.voice)];
    if (voice) {
      setHasVioce(true);
      setVoice(voice);
      setPlaybak(Playback.Play);
    }
  }, []);

  useEffect(() => {
    return () => {
      speech.onend = undefined;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlayback = () => {
    switch (playback) {
      case Playback.Play:
        speechSynth.speak(speech);
        setPlaybak(Playback.Pause);
        break;
      case Playback.Pause:
        speechSynth.pause();
        setPlaybak(Playback.Resume);
        break;
      case Playback.Resume:
        speechSynth.cancel();
        setPlaybak(Playback.Play);
        break;
      default:
        speechSynth.cancel();
        break;
    }
  };

  const handleEnterWord = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!wordForm.current) return;

    const answer: string = wordForm.current.answer.value
      .trim()
      .toLocaleLowerCase();
    const splitedAnswer = splitByWords(answer);
    const result = splitedPazzle.every(
      (item, index) => item.toLocaleLowerCase() === splitedAnswer[index],
    );
    setIsAnswerRight(result);
    if (!allowNext) {
      setIsFirstAnswerRight(result);
    }
    setAllowNext(true);
  };

  const handleNextWord = () => {
    setPlaybak(Playback.Play);
    wordForm.current.answer.value = '';
    setAllowNext(false);
    next(isFirstAnswerRight);
  };

  return (
    <QuizCard
      title="Listen and write"
      pazzle={allowNext ? pazzleWord.translation : ''}
      disabledNext={!allowNext}
      handleNextWord={handleNextWord}
    >
      <Row className="p-2 text-light d-flex justify-content-center">
        <Button variant="primary" onClick={handlePlayback} disabled={!hasVoice}>
          {playback}
        </Button>
      </Row>
      <Card.Title className="p-2 text-primary d-flex justify-content-center height40">
        {allowNext && pazzleWord.word}
      </Card.Title>
      <Form onSubmit={handleEnterWord} ref={wordForm}>
        <InputGroup>
          <FormControl
            className={inputClasses.join(' ')}
            id="answer"
            autoComplete="off"
          />
          {allowNext ? (
            <Button variant="primary" onClick={handleNextWord}>
              <ArrowRight />
            </Button>
          ) : (
            <Button variant="primary" id="give-answer" type="submit">
              <ArrowRight />
            </Button>
          )}
        </InputGroup>
      </Form>
      <Row className="mt-5 text-secondary text-center">
        <small>{speech?.voice?.name}</small>
      </Row>
    </QuizCard>
  );
}

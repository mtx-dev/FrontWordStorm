import React, { useState } from 'react';
import useAsyncEffect from '../hoocks/useAsyncEffect';

const getVoices = (): Promise<any[]> => {
  return new Promise((resolve) => {
    window.speechSynthesis.onvoiceschanged = (_e) => {
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.getVoices();
  });
};

export default function SettingsSection() {
  const [voices, setVoices] = useState([]);
  useAsyncEffect(async () => {
    const voicesTry = window.speechSynthesis.getVoices();
    const voices = voicesTry.length ? voicesTry : await getVoices();
    if (voices) {
      setVoices(voices);
    }
  }, []);
  return (
    <div>
      SettingsSection
      <h3>voices</h3>
      <ul>
        {voices.map((v, index) => (
          <li key={v?.name}>
            {index}
            {'   '}
            {v.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import useAsyncEffect from '../hoocks/useAsyncEffect';
import useSettings from '../hoocks/useSettings';
import { sortVoices } from '../utils/sortVoices';

// eslint-disable-next-line no-undef
const getVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    window.speechSynthesis.onvoiceschanged = (_e) => {
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.getVoices();
  });
};

export default function SettingsSection() {
  const { settings, saveSettings } = useSettings();
  const [voices, setVoices] = useState([]);
  const [currentVoice, setCurrentVoice] = useState(settings.voice);

  useAsyncEffect(async () => {
    const voicesTry = window.speechSynthesis.getVoices();
    const voices = voicesTry.length ? voicesTry : await getVoices();
    if (voices) {
      const sortedVoices = sortVoices(voices);
      setVoices(sortedVoices);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentVoice(e.target.value);
  };

  const handleSave = async () => {
    const newSettings = { ...settings };
    newSettings.voice = currentVoice;
    await saveSettings(newSettings);
  };

  return (
    <Row className="justify-content-center m-0">
      <Col xs={10} sm={8} md={6}>
        <h2 className="mt-4">Settings</h2>
        <Form className="mt-4">
          <Form.Group controlId="soundOn" className="mb-4">
            <Form.Check type="switch" id="soundOn" label="Quizes with sound" />
          </Form.Group>
          <Form.Group controlId="formVoice">
            <Form.Label>Voice</Form.Label>
            <Form.Select value={currentVoice} onChange={handleChange}>
              {voices.map((v, index) => (
                <option key={index} value={index}>
                  {v?.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Button
            className="mt-4"
            onClick={handleSave}
            disabled={currentVoice === settings.voice}
            type="submit"
          >
            Save
          </Button>
        </Form>
      </Col>
    </Row>
  );
}

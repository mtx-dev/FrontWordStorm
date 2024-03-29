import React from 'react';
import { Col, ListGroup, Row } from 'react-bootstrap';
import { IWord } from '../../../models/IWord';
import {
  Reception0,
  Reception1,
  Reception2,
  Reception3,
  Reception4,
  CheckLg,
} from 'react-bootstrap-icons';

const levels = [
  <Reception0 key={0} color="royalblue" size={32} />,
  <Reception1 key={1} color="royalblue" size={32} />,
  <Reception2 key={2} color="royalblue" size={32} />,
  <Reception3 key={3} color="royalblue" size={32} />,
  <Reception4 key={4} color="royalblue" size={32} />,
];

export default function VocabularyItem({
  wordItem,
  onChangeActive,
}: {
  wordItem: IWord;
  onChangeActive: (id: IWord['id'], active: boolean) => void;
}) {
  const itemClasses = ['word-item'];
  if (!wordItem.active) itemClasses.push('disable');
  const status =
    wordItem.status === 'learned' ? (
      <CheckLg color="royalblue" size={32} />
    ) : (
      levels[wordItem.successfulAttempts]
    );
  const handleSwitch = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    onChangeActive(wordItem.id, target.checked);
  };

  return (
    <ListGroup.Item className={itemClasses.join(' ')}>
      <Row className="align-items-center">
        <Col xs={7}>
          <Row className="align-items-center justify-content-end">
            <Col sm={6} className="fs-5">
              {wordItem.word}
            </Col>
            <Col sm={6}>{wordItem.translation}</Col>
          </Row>
        </Col>
        <Col xs={5}>
          <Row className="align-items-center justify-content-end">
            <Col xs="auto">{status}</Col>
            <Col xs="auto">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                  onChange={handleSwitch}
                  defaultChecked={wordItem.active}
                />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </ListGroup.Item>
  );
}

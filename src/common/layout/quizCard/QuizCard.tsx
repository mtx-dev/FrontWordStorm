import React from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';

const QuizCard = ({
  children,
  disabledNext,
  handleNextWord,
  title,
  pazzle,
}: {
  children: JSX.Element | JSX.Element[];
  disabledNext: boolean;
  handleNextWord: () => void;
  title: string;
  pazzle?: string;
}) => {
  return (
    <Row className="justify-content-center m-0 p-0 quiz-card-outside">
      <div className="p-0 quiz-card-container">
        <Card className="p-3 quiz-card">
          <Card.Header>
            <Row>
              <Col>{title}</Col>
              <Col xs="auto">
                <Button
                  variant={disabledNext ? 'outline-secondary' : 'primary'}
                  disabled={disabledNext}
                  onClick={handleNextWord}
                >
                  next
                </Button>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <Card.Title className="p-2 text-light d-flex justify-content-center">
              {pazzle}
            </Card.Title>
            {children}
          </Card.Body>
        </Card>
      </div>
    </Row>
  );
};

export default QuizCard;

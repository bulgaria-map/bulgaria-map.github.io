import React, { useState, useEffect } from 'react';
import { X, Check, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RegionData } from '@/data/questions';
import { Button } from '@/components/ui/button';

interface QuizPopupProps {
  region: RegionData;
  onClose: () => void;
  onComplete: (score: number, total: number) => void;
  isClosing: boolean;
}

const QuizPopup: React.FC<QuizPopupProps> = ({ region, onClose, onComplete, isClosing }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [score, setScore] = useState(0);

  const question = region.questions[currentQuestion];
  const isLastQuestion = currentQuestion === region.questions.length - 1;
  const isCorrect = selectedAnswer === question.correctIndex;

  const handleConfirm = () => {
    if (selectedAnswer === null) return;
    
    setIsAnswerRevealed(true);
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const finalScore = score + (isCorrect ? 0 : 0);
      onComplete(score + (selectedAnswer === question.correctIndex ? 1 : 0) - (isAnswerRevealed ? (isCorrect ? 1 : 0) : 0), region.questions.length);
    } else {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerRevealed(false);
    }
  };

  const handleFinish = () => {
    onComplete(score, region.questions.length);
  };

  const answerLabels = ['а)', 'б)', 'в)'];

  return (
    <div className={cn(
      'fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center',
      'bg-foreground/20 backdrop-blur-sm fade-in'
    )}>
      <div
        className={cn(
          'relative w-full max-w-lg bg-card rounded-xl shadow-2xl overflow-hidden',
          isClosing ? 'slide-down-exit' : 'slide-up-enter'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
          <h2 className="text-xl font-bold text-foreground">{region.name}</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">
              {currentQuestion + 1}/{region.questions.length}
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-accent transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Question */}
        <div className="p-6">
          <p className="text-lg font-medium text-foreground mb-6">{question.question}</p>

          {/* Answer Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectAnswer = index === question.correctIndex;
              
              let optionClass = 'answer-option';
              if (isAnswerRevealed) {
                if (isCorrectAnswer) {
                  optionClass += ' revealed-correct';
                } else if (isSelected && !isCorrectAnswer) {
                  optionClass += ' incorrect';
                }
              } else if (isSelected) {
                optionClass += ' selected';
              }

              return (
                <button
                  key={index}
                  onClick={() => !isAnswerRevealed && setSelectedAnswer(index)}
                  disabled={isAnswerRevealed}
                  className={optionClass}
                >
                  <span className="flex items-center gap-3">
                    <span className="font-semibold text-muted-foreground">{answerLabels[index]}</span>
                    <span>{option}</span>
                    {isAnswerRevealed && isCorrectAnswer && (
                      <Check className="w-5 h-5 text-success ml-auto" />
                    )}
                    {isAnswerRevealed && isSelected && !isCorrectAnswer && (
                      <XCircle className="w-5 h-5 text-destructive ml-auto" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Result Feedback */}
          {isAnswerRevealed && (
            <div className={cn(
              'mt-6 p-4 rounded-lg text-center font-semibold fade-in',
              isCorrect ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
            )}>
              {isCorrect ? 'Правилно! 🎉' : 'Грешен отговор 😔'}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-border bg-muted/30">
          {!isAnswerRevealed ? (
            <Button
              onClick={handleConfirm}
              disabled={selectedAnswer === null}
              className="px-6"
            >
              Потвърди
            </Button>
          ) : (
            <Button
              onClick={isLastQuestion ? handleFinish : handleNext}
              className="px-6"
            >
              {isLastQuestion ? 'Завърши' : 'Следващ въпрос'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPopup;

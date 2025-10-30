import { useEffect, useState } from 'react';
import data from '../../data/questions.json';
import './GameView.css';

export const GameView = () => {
    const [ questionIndex, setQuestionIndex ] = useState(0);
    const [ teamAnswering, setTeamAnswering ] = useState(null);
    const [ wasRightAnswer, setWasRightAnswer ] = useState(null);

    useEffect(() => {
        const keyEventCallback = (event) => {
            if (!teamAnswering) {
                if (event.key === 'n') {
                    setTeamAnswering('niebiescy');
                } else if (event.key === 'm') {
                    setTeamAnswering('złoci');
                }
            }
        }

        window.addEventListener('keydown', keyEventCallback);

        return () => window.removeEventListener('keydown', keyEventCallback)
    }, [teamAnswering])

    useEffect(() => {
        const keyEventCallback = (event) => {
            if (teamAnswering) {
                if (event.key === 'a') {
                    setWasRightAnswer('poprawna');
                } else if (event.key === 's') {
                    setWasRightAnswer('niepoprawna');
                }
            }

        }

        window.addEventListener('keydown', keyEventCallback);

        return () => window.removeEventListener('keydown', keyEventCallback)
    }, [teamAnswering]);

    const getAnsweringTeamOverlayClass = () => {
        if (teamAnswering) {
            if (teamAnswering === 'złoci') {
                return 'zloci';
            } else {
                return 'niebiescy';
            }
        }

        return '';
    }

    const getAnswerOverlay = () => {
        if (teamAnswering) {
            if (wasRightAnswer === 'poprawna') {
                return 'poprawna';
            } else {
                return 'niepoprawna';
            }
        }

        return '';
    }

    const switchToNextQuestion = () => {
        setTimeout(() => {
            setQuestionIndex(questionIndex + 1);
            setTeamAnswering(null);
            setWasRightAnswer(null);
        }, 5000)
    }
    
    return <div className='game-view-container'>
        { teamAnswering && <div className={'team-overlay ' + getAnsweringTeamOverlayClass()}></div> }
        { wasRightAnswer && <div className={'team-overlay ' + getAnswerOverlay()}></div> }
            <div className='scores-container'>
                <div className='team-score team1'>
                    <div>NIEBIESCY:</div>
                    <div className='score-value'>100 pkt</div>

                </div>
                <div className='team-score team2'>
                    <div>ZŁOCI:</div>
                    <div className='score-value'>200 pkt</div>
                </div>
            </div>
            <div className='question-container'>
                { wasRightAnswer && <div className='answer'>Poprawna odpowiedź: {data.questions[questionIndex].answer}</div> }
                {!wasRightAnswer && <div className='question'>
                    {data.questions[questionIndex].question}
                </div>}
            </div>
            {
                (teamAnswering && !wasRightAnswer) && <div className='answering-team-container'>
                    <div className="answering-team">Odpowiadają {teamAnswering}</div>
                </div>
            }
            {
                wasRightAnswer && <div className='answering-team-container'>
                    <div className="answering-team" onClick={switchToNextQuestion}>Następne pytanie</div>
                </div>
            }
    </div>
}
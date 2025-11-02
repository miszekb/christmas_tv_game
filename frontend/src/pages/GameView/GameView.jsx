import { useEffect, useState } from 'react';
import data from '../../data/questions.json';
import './GameView.css';

export const GameView = () => {
    const [ questionIndex, setQuestionIndex ] = useState(0);
    const [ teamAnswering, setTeamAnswering ] = useState(null);
    const [ wasRightAnswer, setWasRightAnswer ] = useState(null);
    const [ zlociScore, setZlociScore ] = useState(0);
    const [ niebiescyScore, setNiebiescyScore ] = useState(0);
    const [ questionBlockade, setQuestionBlockade ] = useState(false);
    const [ countdownValue, setCountdownValue ] = useState(5);
    const [ activeCountdown, setActiveCountdown ] = useState(false);

    useEffect(() => {
        if (window.esp32) {
            window.esp32.onData((data) => {
                if (!teamAnswering) {
                    if (data.includes('NIEBIESCY')) {
                        setTeamAnswering('niebiescy')
                    }
                }
            });
        }
    }, [])

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
                    if (teamAnswering === 'niebiescy') {
                        setNiebiescyScore(niebiescyScore + 100);
                    } else {
                        setZlociScore(zlociScore + 100);
                    }
                } else if (event.key === 's') {
                    setWasRightAnswer('niepoprawna');
                    if (teamAnswering === 'niebiescy') {
                        setNiebiescyScore(niebiescyScore - 50);
                        setZlociScore(zlociScore + 50);
                    } else {
                        setZlociScore(zlociScore - 50);
                        setNiebiescyScore(niebiescyScore + 50);
                    }
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

    useEffect(() => {
        if (countdownValue > 0 && activeCountdown) {
            setTimeout(() => {
            setCountdownValue(countdownValue - 1);
            }, 1000)
        }

        if (countdownValue === 0) {
            setQuestionIndex(questionIndex + 1);
            setQuestionBlockade(false)
            setCountdownValue(5);
            setActiveCountdown(false)
        }
    }, [activeCountdown, countdownValue])

    const switchToNextQuestion = () => {
        setCountdownValue(5);
        setActiveCountdown(true);
        setQuestionBlockade(true);
        setTeamAnswering(null);
        setWasRightAnswer(null);
    }
    
    return <div className='game-view-container'>
        { teamAnswering && <div className={'team-overlay ' + getAnsweringTeamOverlayClass()}></div> }
        { wasRightAnswer && <div className={'team-overlay ' + getAnswerOverlay()}></div> }
        <div className='scores-container'>
            <div className='team-score team1'>
                <div>NIEBIESCY:</div>
                <div className='score-value'>{niebiescyScore} pkt</div>
            </div>
            <div className='team-score team2'>
                <div>ZŁOCI:</div>
                <div className='score-value'>{zlociScore} pkt</div>
            </div>
        </div>
            { (questionBlockade && activeCountdown ) &&
                <div className='countdown-container'>
                    <div className='countdown-value'>{countdownValue}</div>
                </div>
            }
            { !questionBlockade && <div className='question-container'>
                { wasRightAnswer && <div className='answer'>Poprawna odpowiedź: {data.questions[questionIndex].answer}</div> }
                {!wasRightAnswer && <div className='question'>
                    {data.questions[questionIndex].question}
                </div>
                }
            </div>
            }
            {
                (teamAnswering && !wasRightAnswer) && <div className='answering-team-container'>
                    <div className="answering-team">Odpowiadają {teamAnswering}</div>
                </div>
            }
            {
                wasRightAnswer && <div className='answering-team-container'>
                    <div className="next-question-button " onClick={switchToNextQuestion}>Następne pytanie</div>
                </div>
            }
    </div>
}
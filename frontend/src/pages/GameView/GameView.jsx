import { useEffect, useRef, useState } from 'react';
import data from '../../data/questions.json';
import './GameView.css';
import CrownIcon from '../../assets/golden_crown.svg?react';

export const GameView = () => {
    const [ questionIndex, setQuestionIndex ] = useState(-1);
    const [ teamAnswering, setTeamAnswering ] = useState(null);
    const [ wasRightAnswer, setWasRightAnswer ] = useState(null);
    const [ zlociScore, setZlociScore ] = useState(0);
    const [ niebiescyScore, setNiebiescyScore ] = useState(0);
    const [ questionBlockade, setQuestionBlockade ] = useState(false);
    const [ countdownValue, setCountdownValue ] = useState(5);
    const [ activeCountdown, setActiveCountdown ] = useState(false);
    const [ displayGameEndScreen, setDisplayGameEndScreen ] = useState(false);
    const audioRef = useRef(new Audio("question.mp3"));
    // 1️⃣ Create refs to hold the latest state values
    const teamAnsweringRef = useRef(teamAnswering);
    const activeCountdownRef = useRef(activeCountdown);

    // 2️⃣ Keep refs updated on every render
    useEffect(() => {
        teamAnsweringRef.current = teamAnswering;
    }, [teamAnswering]);

    useEffect(() => {
        activeCountdownRef.current = activeCountdown;
    }, [activeCountdown]);


    useEffect(() => {
        if (!window.esp32) return;

        switchToNextQuestion();

        // 3️⃣ Create stable event listener that uses refs
        const handleData = (data) => {
            const audio = new Audio('team_answering.mp3');

            if (!teamAnsweringRef.current && !activeCountdownRef.current) {
                if (data.includes("NIEBIESCY")) {
                    audio.play()
                    audioRef.current.pause();
                    audioRef.current.load();
                    setTeamAnswering("niebiescy");
                } else if (data.includes("ZLOCI")) {
                    audio.play();
                    audioRef.current.pause();
                    audioRef.current.load();
                    setTeamAnswering("złoci");
                }
            }
        };

        // 4️⃣ Register once
        window.esp32.onData(handleData);

        // 5️⃣ Cleanup on unmount
        return () => {
            if (window.esp32.offData) {
                window.esp32.offData(handleData);
            }
        };
    }, []);

    useEffect(() => {
        const keyEventCallback = (event) => {
            if (teamAnswering) {
                if (event.key === 'a') {
                    setWasRightAnswer('poprawna');
                    const audio = new Audio('good.mp3');
                    audio.play()
                    if (teamAnswering === 'niebiescy') {
                        setNiebiescyScore(niebiescyScore + 100);
                    } else {
                        setZlociScore(zlociScore + 100);
                    }
                } else if (event.key === 's') {
                    setWasRightAnswer('niepoprawna');
                    const audio = new Audio('fail.mp3');
                    audio.play()
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
            audioRef.current.loop = true;
            audioRef.current.play();

        }
    }, [activeCountdown, countdownValue])

    const switchToNextQuestion = () => {
        if (questionIndex < data.questions.length - 1) {
            setCountdownValue(5);
            setActiveCountdown(true);
            const audio = new Audio('countdown.mp3');
            audio.play();
        } else {
            setDisplayGameEndScreen(true);
            const audio = new Audio('game-end.mp3');
            audio.play();
        }

        setQuestionBlockade(true);
        setTeamAnswering(null);
        setWasRightAnswer(null);
    }
    
    return <div className='game-view-container'>
        { activeCountdown && <div className='countdown-overlay'></div>}
        { teamAnswering && <div className={'team-overlay ' + getAnsweringTeamOverlayClass()}></div> }
        { wasRightAnswer && <div className={'team-overlay ' + getAnswerOverlay()}></div> }
        { !displayGameEndScreen && <div className='scores-container'>
            <div className='team-score team1'>
                <div>NIEBIESCY:</div>
                <div className='score-value'>{niebiescyScore} pkt</div>
            </div>
            <div className='team-score team2'>
                <div>ZŁOCI:</div>
                <div className='score-value'>{zlociScore} pkt</div>
            </div>
        </div>
        }
            { (questionBlockade && activeCountdown ) &&
                <div className='countdown-container'>
                    <div className='countdown-value'>{countdownValue}</div>
                </div>
            }
            { (!questionBlockade && !displayGameEndScreen) && <div className='question-container'>
                { wasRightAnswer && <div className='answer'>Poprawna odpowiedź: {data.questions[questionIndex]?.answer}</div> }
                {!wasRightAnswer && <div className='question'>
                    {data.questions[questionIndex]?.question}
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
                    <div className="next-question-button " onClick={switchToNextQuestion}>
                        { questionIndex < data.questions.length - 1 ? 'Następne pytanie' : 'Zakończ rundę'}
                    </div>
                </div>
            }
        { displayGameEndScreen &&
            <div className='game-end-screen-container'>
                <div className='game-end-screen-info'>
                    Koniec rundy
                    <div className='game-end-score'>
                        <div className='team-score team1'>
                            {(niebiescyScore > zlociScore) && <div className='crown'><CrownIcon width={100} height={60}/></div>}
                            <div>NIEBIESCY</div>
                            <div className='score-value'>{niebiescyScore} pkt</div>
                        </div>
                        <div className='team-score team2'>
                            {(niebiescyScore < zlociScore) && <div className='crown'><CrownIcon width={100} height={60}/></div>}
                            <div>ZŁOCI</div>
                            <div className='score-value'>{zlociScore} pkt</div>
                        </div>
                    </div>
                </div>
            </div>
        }
    </div>
}
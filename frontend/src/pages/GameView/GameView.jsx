import './GameView.css';

export const GameView = () => {

    return <div className='game-view-container'>
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
            <div className='question'>
                Z obecnych tu osób, ile urodziło się po 1990 roku?
            </div>
        </div>
        <div className='answering-team-container'>
            <div className="answering-team">Odpowiadają złoci</div>
        </div>
    </div>
}

import { Link } from 'react-router-dom';
import './BeforeGame.css';

export const BeforeGame = () => {
    return <div className='before-game-container'>
        <Link to="/game">
            <div className='start-game-button'>Rozpocznij grę!</div>
        </Link>
    </div>
}
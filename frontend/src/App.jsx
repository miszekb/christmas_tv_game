import './App.css'
import { BeforeGame } from './pages/BeforeGame/BeforeGame';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GameView } from './pages/GameView/GameView';

function App() {
  return <div className="page-container">
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<BeforeGame/>} />
        <Route path='/game' element={<GameView/>} />
      </Routes>
    </BrowserRouter>
  </div>;
}

export default App

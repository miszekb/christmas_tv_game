import { useState, useEffect } from 'react'
import './App.css'
import { ButtonLED } from './components/ButtonLED/ButtonLED'
import { BeforeGame } from './pages/BeforeGame/BeforeGame';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GameView } from './pages/GameView/GameView';

function App() {
  const [leftButtonState, setLeftButtonState] = useState(false);
  const [rightButtonState, setRightButtonState] = useState(false);

  const [messages, setMessages] = useState([]);



  return <div className="page-container">
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<BeforeGame/>} />
        <Route path='/game' element={<GameView/>} />
      </Routes>
    </BrowserRouter>
  </div>;
    // <div style={{ padding: 20 }}>
    //   <h1 onClick={() => alert(window.esp32)}>ESP32 Serial Monitor</h1>
    //   <ul>
    //     {messages.map((msg, i) => (
    //       <li key={i}>{msg}</li>
    //     ))}
    //   </ul>
    // </div>
    
  //   <div className="page-container">
  //     <div className="controls-container">
  //       <p>Helloo</p>
  //       <div className="leds-container">
  //         <ButtonLED isEnabled={leftButtonState}></ButtonLED>
  //         <ButtonLED isEnabled={rightButtonState}></ButtonLED>
  //       </div>
  //     </div>
  //   </div>
  // )
}

export default App

import { useState } from 'react'

//import DebugLog from "./components/debugLog"
import GameArea from "./components/gameArea"

function App() {

  const [gameStateHistory, setGameStateHistory] = useState<string[][][]>([]);

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
      {/* <div style={{flex: 1, backgroundColor: 'white', margin: '20px', padding: '20px'  }}>
        <DebugLog gameStateHistory={gameStateHistory} />
      </div> */}
      <div style={{flex: 5, margin: '20px', padding: '20px' }}>
        <GameArea gameStateHistory={gameStateHistory} setGameStateHistory={setGameStateHistory} />
      </div>
    </div>
  )
}

export default App

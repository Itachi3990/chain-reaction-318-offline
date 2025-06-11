function DebugLog({  gameStateHistory
}: { gameStateHistory: string[][][] }) {
  return (
    <div style={{ overflowY: 'scroll', height: '100%' }}>
      {gameStateHistory.map((gameState, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <h3>Turn {index + 1}</h3>
          <ul>
            {gameState.map((state, stateIndex) => (
              <li key={stateIndex}>{state.join(' ')}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default DebugLog

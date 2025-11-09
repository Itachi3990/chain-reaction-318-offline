import { useState, useEffect } from "react";

import blue1 from './assets/1B.png'
import blue2 from './assets/2B.png'
import blue1_s from './assets/1B_s.gif'
import blue2_s from './assets/2B_s.gif'
import blue3_s from './assets/3B_s.gif'

import red1 from './assets/1R.png'
import red2 from './assets/2R.png'
import red1_s from './assets/1R_s.gif'
import red2_s from './assets/2R_s.gif'
import red3_s from './assets/3R_s.gif'

import boom from './assets/boom.png'

import AiMove from "./aiMovePlugin";


function GameArea({ gameStateHistory, setGameStateHistory } : { gameStateHistory: string[][][], setGameStateHistory: (history: string[][][]) => void }) {

  const gameMode = ["Player vs AI", "AI vs AI"]
  const aiHeuristics = ["Tile Count", "Orb Count", "Boundary Control", "Stack Control", "Orb Boundary Mix", "Random Move" ]

  const [gameModeIndex, setGameModeIndex] = useState(0); // Default to Player vs AI mode

  const [numRows, setNumRows] = useState(5);
  const [numCols, setNumCols] = useState(8);
  const [squares, setSquares] = useState(Array.from({ length: numRows * numCols }));

  const [isAIautoMode, setIsAIAutoMode] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);

  const rowLimit = Array.from({ length: 13 }, (_, i) => i + 3);
  const colLimit = Array.from({ length: 8 }, (_, i) => i + 4);


  const [gameState, setGameState] = useState(Array.from({ length: numRows }, () => Array.from({ length: numCols }, () => '0')));

  const [aiDepth, setAIDepth] = useState(4); // Default AI depth
  const [aiHeuristicIndexA, setAiHeuristicIndexA] = useState(0); // Default AI heuristic index
  const [aiHeuristicIndexB, setAiHeuristicIndexB] = useState(0); // Default AI heuristic index for player B

  useEffect(() => {
    const totalSquares = numRows * numCols;
    setSquares(Array.from({ length: totalSquares }));
    setGameState(Array.from({ length: numRows }, () => Array.from({ length: numCols }, () =>'0')));
        // Reset game history when dimensions change to prevent mismatched states
    setGameStateHistory([]);
    // Stop any ongoing AI operations
    setIsAIThinking(false);
    setIsAIAutoMode(false);
 }, [numRows, numCols]);

  const handleRowChange = (event : any) => {
    setNumRows(event.target.value);
  };

  const handleColChange = (event : any) => {
    setNumCols(event.target.value);
  }

  const onCellClick = (index: number, color : string) => {
    if( isAIThinking ) return;
    
    const i = Math.floor(index / numCols);
    const j = index % numCols;
    
    const newGameState = [...gameState];

    if(newGameState[i][j] === '0' )
        newGameState[i][j] = '1' + color; // 1R or 1B
    else {
        const currCnt = parseInt(newGameState[i][j].charAt(0));
        const currColor = newGameState[i][j].charAt(1);
        
        if(currColor !== color) //invalid move, cant place on opponent's orb
            return;
        
        newGameState[i][j] = `${currCnt+1}${currColor}`;
    }

    // Save the current game state to history
    //console.log("before Saving game state to history", gameStateHistory);
    // Deep copy the newGameState to avoid mutation issues
    const deepCopiedGameState = newGameState.map(row => [...row]);
    const newGameStateHistory = [...gameStateHistory, deepCopiedGameState];
    //console.log("newGameStateHistory", newGameStateHistory);
    setGameStateHistory(newGameStateHistory);
    setGameState(newGameState); //this calls useEffect which checks for reactions and setsIntervalBetnTurns to false if no reactions occur
  }

  const getWidth = () => {
    if (numCols <= 5)
        return 'w-1/3';
    if (numCols == 6)
        return 'w-1/2';
    return 'w-full';
  }

  const getOrbImage = (index : number) => {

    const i = Math.floor(index / numCols);
    const j = index % numCols;
    if(!gameState || !gameState[i] || !gameState[i][j]) return null;
    const cellValue = gameState[i][j];

    const orbCnt = parseInt(cellValue.charAt(0));
    if(orbCnt >= getMaxWeight(i, j))
        return <img src={boom} alt="Boom" />

    if (cellValue === '1R') {
        if((i==0 || i==gameState.length-1) && (j==0 || j==gameState[0].length-1))
            return <img src={red1_s} alt="Red Orb 1 Small" />
        return <img src={red1} alt="Red Orb 1" />
    }

    if (cellValue === '2R') {
        if(i==0 || j==0 || i==gameState.length-1 || j==gameState[0].length-1) 
            return <img src={red2_s} alt="Red Orb 1" />
        return <img src={red2} alt="Red Orb 2" />
    }

    if (cellValue === '3R') return <img src={red3_s} alt="Red Orb 3 Small" />;

    // Blue orbs
    if (cellValue === '1B') {
        if((i==0 || i==gameState.length-1) && (j==0 || j==gameState[0].length-1))
            return <img src={blue1_s} alt="Blue Orb 1 Small" />
        return <img src={blue1} alt="Blue Orb 1" />
    }

    if (cellValue === '2B') {
        if(i==0 || j==0 || i==gameState.length-1 || j==gameState[0].length-1) 
            return <img src={blue2_s} alt="Blue Orb 1 Small" />
        return <img src={blue2} alt="Blue Orb 2" />
    }

    if (cellValue === '3B') return <img src={blue3_s} alt="Blue Orb 3 Small" />;

  }

  const getMaxWeight = (i:number, j:number) => {
    let maxWeight = 4;

    if(i==0 || i==numRows-1) maxWeight--;
    if(j==0 || j==numCols-1) maxWeight--;

    return maxWeight;
  }

  const isFullOfSameColor = () => {
    let color = "";
    for (const row of gameState)
      for (const cell of row) 
        if (cell !== '0') {
          if (color === "") 
            color = cell.charAt(1); // Get the color of the first piece
          else if (cell.charAt(1) !== color) 
            return '0'; // Found a different color     
        }
    return color; // Return true if all pieces are of the same color  
  }

    const claimOrbsOrthogonally = (
        i: number,
        j: number,
        color: string,
        gameState: string[][]
    ) => {
        // Up
        if (i > 0) {
            if (gameState[i - 1][j] === "0") {
                gameState[i - 1][j] = "1" + color;
            } else {
                let count = parseInt(gameState[i - 1][j].charAt(0));
                gameState[i - 1][j] = `${count + 1}${color}`;
            }
        }
        // Down
        if (i < gameState.length - 1) {
            if (gameState[i + 1][j] === "0") {
                gameState[i + 1][j] = "1" + color;
            } else {
                let count = parseInt(gameState[i + 1][j].charAt(0));
                gameState[i + 1][j] = `${count + 1}${color}`;
            }
        }
        // Left
        if (j > 0) {
            if (gameState[i][j - 1] === "0") {
                gameState[i][j - 1] = "1" + color;
            } else {
                let count = parseInt(gameState[i][j - 1].charAt(0));
                gameState[i][j - 1] = `${count + 1}${color}`;
            }
        }
        // Right
        if (j < gameState[0].length - 1) {
            if (gameState[i][j + 1] === "0") {
                gameState[i][j + 1] = "1" + color;
            } else {
                let count = parseInt(gameState[i][j + 1].charAt(0));
                gameState[i][j + 1] = `${count + 1}${color}`;
            }
        }
        return gameState;
    };

    const makeAImove = async () => {
        if(gameModeIndex !== 1 && gameStateHistory.length % 2 === 0){
            setIsAIThinking(false); 
            return; // AI only plays in AI vs AI mode or when it's player B's turn
        }


         //need to flatten the gameState to a string
        const gameStateStr = gameState.map(row => row.join(',')).join(',');

        const toformatHeuristic = gameStateHistory.length % 2 ? aiHeuristics[aiHeuristicIndexB] : aiHeuristics[aiHeuristicIndexA];

        
        const { aiMove } = await AiMove.makeMove({
            stateStr: gameStateStr,
            rows: numRows,
            depth: aiDepth,
            heuristic: toformatHeuristic.toLowerCase().replace(' ', '_').replace(' ', '_'),
            playingFor: gameStateHistory.length % 2 ? "B" : "R",
        });

        setIsAIThinking(false); 

        if( aiMove < 0 || aiMove >= numRows * numCols ) {
            alert("Invalid AI move: " + aiMove);
            return; // Invalid move, do not update the game state
        }

        const moveFor = gameStateHistory.length % 2 ? "B" : "R"; // AI plays with blue orbs if it's player B's turn
        onCellClick(aiMove, moveFor); // AI plays with blue orbs

    }


  useEffect(() => {
    const fullyFilledWithSameColor = isFullOfSameColor();

    // if( fullyFilledWithSameColor === "" && isAIautoMode && gameModeIndex===1){   //initial state after reset, used for data analysis REVERT
    //     console.log("here");
    //     makeAImove();
    //     return;
    // }

    if (fullyFilledWithSameColor !== '0' && gameStateHistory.length > 1) {
        alert(`Game Over! ${fullyFilledWithSameColor} wins!`);    //REVERT
        //fetch(`http://localhost:4000/logwin?color=${encodeURIComponent(fullyFilledWithSameColor+' '+getCurrentTimeInSeconds())}`, {method: 'GET'});
        //resetGame(true);    //REVERT
        return;
    }        

    let reactionOccurred = false;
    let newGameState = gameState.map(row => [...row]);

    for (let i = 0; i < newGameState.length; i++) 
        for (let j = 0; j < newGameState[i].length; j++) {
            const cell = newGameState[i][j];
            if (cell !== "0") {
                const count = parseInt(cell.charAt(0));
                const maxWeight = getMaxWeight(i, j);
                if (count >= maxWeight) {
                    reactionOccurred = true;
                    const overloadedBy = cell.charAt(1);
                    const newCount = count - maxWeight;
                    if (newCount === 0)
                        newGameState[i][j] = "0";
                    else 
                        newGameState[i][j] = `${newCount}${overloadedBy}`;
                    
                    newGameState = claimOrbsOrthogonally(i, j, overloadedBy, newGameState);
                }
            }
        }
    

    if (reactionOccurred) {
        setTimeout(() => {
            setGameState(newGameState)
        }, 350);
       // setGameState(newGameState);   //REVERT
    }

    else {
        //console.log("current move done");                                   //even turn means player's turn
        if(isAIautoMode && !isAIThinking && gameStateHistory.length > 0 &&((gameModeIndex===0 && gameStateHistory.length % 2) || gameModeIndex===1)) {
            setIsAIThinking(true);
            makeAImove();
        }
    }
    
  }, [gameState]);

  const resetGame = (restart=false) => {
    setGameState(Array.from({ length: numRows }, () => Array.from({ length: numCols }, () => '0')));
    setGameStateHistory([]); // Reset the game state history
    setIsAIAutoMode(restart);
    
} 

useEffect(() => {
    // Reset the game state when the game mode changes
    if (gameModeIndex === 0) {
        setIsAIAutoMode(false);
        setIsAIThinking(false);
    } else if(gameStateHistory.length > 0){
        setIsAIAutoMode(true);
        setIsAIThinking(true);
        makeAImove();
    }
}
, [gameModeIndex]);

const gridColsClass = {
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
  9: "grid-cols-9",
  10: "grid-cols-10",
  11: "grid-cols-11",
  12: "grid-cols-12",
}[numCols] || "grid-cols-8";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
      <div className="flex-1 w-full">
        <h1 className="text-4xl text-blue-200 font-bold mb-4 flex-1 text-center">Game Area</h1>
        <div className="flex flex-row justify-center items-center gap-4 mb-4">
            <div className="bg-transparent border-2 border-blue-300 rounded-lg p-4 text-lg text-blue-200 font-bold">
                <span>Rows:</span>
                <select
                    value={numRows}
                    onChange={handleRowChange}
                >
                    {rowLimit.map((num) => (
                        <option key={num + 'row'} value={num} className="text-black">
                            {num}
                        </option>
                    ))}
                </select>
            </div>
            <div className="bg-transparent border-2 border-blue-300 rounded-lg p-4 text-lg text-blue-200 font-bold">
                <span>Columns:</span>
                <select value={numCols} onChange={handleColChange}>
                    {colLimit.map((num) => (
                        <option key={num + 'col'} value={num} className="text-black">
                            {num}
                        </option>
                    ))}
                </select>
            </div>
            <div className="bg-transparent border-2 border-blue-300 rounded-lg p-4 text-lg text-blue-200 font-bold">
                <select value={gameModeIndex} onChange={(e)=> setGameModeIndex(parseInt(e.target.value))}>
                    {gameMode.map((mode, index) => (
                        <option key={mode} value={index} className="text-black">
                            {mode}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <button
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    onClick={() => resetGame()}
                >
                    Reset
                </button>
            </div>
        </div>
        <div className="flex flex-row justify-center items-center gap-4 mb-4">
            <label className="flex items-center space-x-2 text-blue-200 font-bold">
                <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600"
                    checked={isAIautoMode}
                    onChange={(e) => setIsAIAutoMode(e.target.checked)}
                />
                <span>Auto-mode</span>
            </label>
            <div>
                <label className="bg-transparent border-2 border-blue-300 rounded-lg p-2 text-blue-200 font-bold">
                    <span>AI depth:</span>
                    <select
                        className="rounded px-2 py-1"
                        value={aiDepth}
                        disabled={isAIThinking}
                        onChange={(e) => setAIDepth(parseInt(e.target.value))}
                    >
                        {Array.from({ length: 9 }, (_, i) => i + 2).map((depth) => (
                            <option key={depth} value={depth} className="text-black ">{depth}</option>
                        ))}
                    </select>
                </label>
            </div>
            {gameModeIndex === 1 &&
            <div>
                <label className="bg-transparent border-2 border-blue-300 rounded-lg p-2 text-blue-200 font-bold">
                    <span>AI heuristic R:</span>
                    <select
                        className="rounded px-2 py-1 text-center"
                        value={aiHeuristicIndexA}
                        onChange={(e) => setAiHeuristicIndexA(parseInt(e.target.value))}
                        disabled={isAIautoMode}
                    >
                        {aiHeuristics.map((heuristic, index) => (
                            <option key={heuristic} value={index} className="text-black">
                                {heuristic}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            }
            <div>
                <label className="bg-transparent border-2 border-blue-300 rounded-lg p-2 text-blue-200 font-bold">
                    <span>AI heuristic {gameModeIndex===1 && 'B'}:</span>
                    <select
                        className="rounded px-2 py-1 text-center"
                        value={aiHeuristicIndexB}
                        onChange={(e) => setAiHeuristicIndexB(parseInt(e.target.value))}
                        disabled={isAIautoMode}
                    >
                        {aiHeuristics.map((heuristic, index) => (
                            <option key={heuristic} value={index} className="text-black">
                                {heuristic}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div>
                <button
                    disabled={ (gameModeIndex===0 && isAIautoMode) || isAIThinking}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                    onClick={() => {
                        setIsAIThinking(true);
                        makeAImove();
                    }}
                >{
                    isAIThinking ? 
                    <>
                        <div className = "h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                        Thinking
                    </> : <>AI Turn</>}
                </button>
            </div>
        </div>
      </div>
      <div className={`flex-6 ${getWidth()}`} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px' }}>
        <div className={`grid ${gridColsClass} gap-1 w-full max-w-screen-md mx-auto`} style={{overflowY: 'auto', maxHeight: '70vh'}}>
            {squares.map((_, index) => (
                <div
                key={index}
                className="bg-transparent border-2 border-blue-300 aspect-square rounded-lg flex items-center justify-center"
                style={{ maxHeight: '100px'}}
                onClick={() => {if(gameModeIndex===0) onCellClick(index, "R")}}
                >
                    {gameState.length && gameState[0].length && getOrbImage(index)}
                </div>
            ))}
        </div>
    </div>
    </div>
  )
}

export default GameArea

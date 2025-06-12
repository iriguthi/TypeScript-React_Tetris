import { useState, useMemo, useEffect, useRef } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import Grid from './components/Grid'
import { Tetromino } from './components/Tetromino';
import { initialGrid, randomTetromino, dropTetromino, nextTetromino, dropInterval } from './logic/gameLogic';
import { handleKeyPressLogic } from './logic/handleKeyPressLogic';

function App() {
  // 20×10の盤面のステータス
  const[grid, setGrid] = useState(initialGrid);

  // テトロミノのステータス
  const [currentTetromino, setCurrentTetromino] = useState<Tetromino>(randomTetromino());
  const [shouldGenerateNewTetromino, setShouldGenerateNewTetromino] = useState(false);

  // ゲームステータス
  const [gameState, setGameState] = useState(false);

// console.log(currentTetromino)
  // 表示用グリッド：固定グリッド+現在のテトロミノを合成し出力
  const displayGrid = useMemo(() => {
    const newGrid = grid.map(row => [...row]);

    currentTetromino.shape.forEach((row, dy) => {
      row.forEach((cell, dx) => {
        if (cell) {
          const x = currentTetromino.x + dx;
          const y = currentTetromino.y + dy;
          if (y >= 0 && y < newGrid.length && x >= 0 && x < newGrid[0].length) {
            newGrid[y][x] = currentTetromino.colorCode;
          }
        }
      });
    });
    return newGrid;
  }, [grid, currentTetromino]);

  // 落下処理
  useEffect(() => {
  const timer = setInterval(() => {
    dropTetromino(grid, setGrid, currentTetromino, setCurrentTetromino, setShouldGenerateNewTetromino);
  }, dropInterval(gameState));
  return () => clearInterval(timer)
  }, [grid, currentTetromino]);

  // 次のテトロミノを生成
  useEffect(() => {
    if (shouldGenerateNewTetromino) {
      nextTetromino(grid, setGameState, setCurrentTetromino, setShouldGenerateNewTetromino);
    }
  }, [shouldGenerateNewTetromino]);

  // 操作系
  // 毎回最新の状態を保持させる(二重発火させない為)
  const currentTetrominoRef = useRef(currentTetromino);
  const gridRef = useRef(grid);
  useEffect(() => {
    currentTetrominoRef.current = currentTetromino;
    gridRef.current = grid;
  }, [currentTetromino, grid]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      handleKeyPressLogic(event, currentTetrominoRef.current, setCurrentTetromino, gridRef.current);
    };

    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);

  return (
    <div className="main_container">
      <div className="grid">
        {/* Tetrisのゲーム盤を表示 */}
        <Grid grid={displayGrid} />
      </div>
      <div className="side_container">
        {/* <div className="next_container">
          <p>Next</p>
          <div id="next_tetromino" className="next_tetromino_box"></div>
        </div> */}
        <div className="score">
          <p>Score</p>
          <p id="score">0</p>
        </div>
        <div className="operation">
          <p>操作</p>
          <p>↑：回転</p>
          <p>← →：左右移動</p>
          <p>↓：落下</p>
          {/* <p>SPACE：一時停止</p> */}
        </div>
      </div>
    </div>
  );
}


export default App

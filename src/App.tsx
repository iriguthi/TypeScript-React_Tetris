import { useState, useMemo, useEffect, useRef } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import Grid from './components/Grid';
import TetrominoDisplay from './components/TetrominoDisplay';
import { Tetromino } from './components/Tetromino';
import { GameState, initialGrid, dropTetromino, gameOver, interval } from './logic/gameLogic';
import { randomTetromino, nextTetromino } from './logic/TetrominoLogic';
import { handleKeyPressLogic } from './logic/handleKeyPressLogic';

function App() {
  // 20×10の盤面のステータス
  const[grid, setGrid] = useState(initialGrid);

  // テトロミノのステータス
  const [currentTetromino, setCurrentTetromino] = useState<Tetromino>(() => randomTetromino());
  const [TetrominoDisplays, setTetrominoDisplay] = useState<Tetromino>(() => randomTetromino());
  const [HoldTetromino, setHoldTetromino] = useState<Tetromino | null>(null);
  const [shouldGenerateNewTetromino, setShouldGenerateNewTetromino] = useState(false);

  // ゲームステータス
  const [gameState, setGameState] = useState<GameState>("playing");

  // 操作中かを判断
  const isPressedRef = useRef(false);

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
      // console.log(gameState)
    if(gameState !== "playing") return
  
    const timer = setInterval(() => {
      dropTetromino(
        gridRef.current,
        setGrid,
        currentTetrominoRef.current,
        setCurrentTetromino,
        setShouldGenerateNewTetromino,
        isPressedRef
      );
    }, interval);
    return () => clearInterval(timer)
  }, [gameState]);

  // 次のテトロミノを生成
  useEffect(() => {
    if (shouldGenerateNewTetromino) {
      nextTetromino(
        grid,
        setGameState,
        setCurrentTetromino,
        setShouldGenerateNewTetromino,
        TetrominoDisplays,
        setTetrominoDisplay
      );
    }
    // console.log(gameState)
  }, [shouldGenerateNewTetromino, gameState]);

  // ゲームオーバー表示
  useEffect(() => {
    gameOver(gameState);
  }, [gameState]);

  // 操作系
  // 毎回最新の状態を保持させる(二重発火させない為)
  const currentTetrominoRef = useRef(currentTetromino);
  const gridRef = useRef(grid);
  useEffect(() => {
    currentTetrominoRef.current = currentTetromino;
    gridRef.current = grid;
  }, [currentTetromino, grid]);

  // 操作時の重複発火対策で55ms間は処理を受け付けない
  const isKeyDownRef = useRef<number>(0);
  const KEY_REPEAT_INTERVAL = 55;

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      // 前回操作から55ms立ってない場合は操作を受け付けない
      const now = Date.now();
      if (now - isKeyDownRef.current <= KEY_REPEAT_INTERVAL) return

      isKeyDownRef.current = now;

      handleKeyPressLogic(
        event,
        currentTetrominoRef.current,
        setCurrentTetromino,
        gridRef.current,
        setGrid,
        setGameState,
        HoldTetromino,
        setHoldTetromino,
        TetrominoDisplays,
        isPressedRef,
        setShouldGenerateNewTetromino
      );
    };

    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [currentTetromino,HoldTetromino]);

  return (
    <div className="main_container">
      <div className='left_side_container'>
        <div className='hold_container'>
          <p>Hold</p>
          {HoldTetromino && (<TetrominoDisplay shape={HoldTetromino.shape} colorCode={HoldTetromino.colorCode}/>)}
        </div>
        <div className="operation">
          <p>操作</p>
          <p>↑：回転</p>
          <p>← →：左右移動</p>
          <p>↓：落下</p>
          <p>SHIFT：ホールド</p>
          <p>SPACE：一時停止</p>
        </div>
      </div>
      <div className="grid">
        {/* Tetrisのゲーム盤を表示 */}
        <Grid grid={displayGrid} />
      </div>
      <div className="right_side_container">
        <div className="next_container">
          <p>Next</p>
          {/* 次弾のテトロミノを表示 */}
          <TetrominoDisplay shape={TetrominoDisplays.shape} colorCode ={TetrominoDisplays.colorCode}/>
        </div>
        <div className="score">
          <p>Score</p>
          <p id="score">0</p>
        </div>
      </div>
    </div>
  );
}


export default App

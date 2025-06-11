import { useState, useMemo, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import Grid from './components/Grid'
import { Tetromino, randomTetromino } from './components/Tetromino';
import { canMove } from './logic/TetrominoLogic';
import { handleKeyPressLogic } from './logic/handleKeyPressLogic';

function App() {
  // 20×10の初期盤面を0で初期化
  const initialGrid = Array.from({ length: 20 }, () => Array(10).fill(0));
  const[grid, setGrid] = useState(initialGrid);

  const [currentTetromino, setCurrentTetromino] = useState<Tetromino>(randomTetromino());
  const [shouldGenerateNewTetromino, setShouldGenerateNewTetromino] = useState(false);
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

  // 落下処理(1秒ごとにY座標1ずつ落下)
  useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTetromino(prev => {
      if (canMove(grid, prev, 0, 1)) {
        // 移動可能なら落下させる
        return { ...prev, y: prev.y + 1 };
      } else {
        // 固定処理
        const newGrid = grid.map(row => [...row]);
        prev.shape.forEach((row, dy) => {
          row.forEach((cell, dx) => {
            if (cell) {
              const x = prev.x + dx;
              const y = prev.y + dy;
              if (y >= 0 && y < newGrid.length && x >= 0 && x < newGrid[0].length) {
                newGrid[y][x] = prev.colorCode;
              }
            }
          });
        });

        // グリッドを更新
        setGrid(newGrid);
        setShouldGenerateNewTetromino(true);
        return prev;
      }
    });
  }, 1000);

  return () => clearInterval(timer);
  }, [grid]);

  // 次のテトロミノを生成
  useEffect(() => {
    if (shouldGenerateNewTetromino) {
      setCurrentTetromino(randomTetromino());
      setShouldGenerateNewTetromino(false);
    }
  }, [shouldGenerateNewTetromino]);

  // 操作系
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      handleKeyPressLogic(event, currentTetromino, setCurrentTetromino, grid);
    };

    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [currentTetromino, grid])

  return (
    <div className="main_container">
      <div id="tetris_container" className="grid">
        {/* Tetrisのゲーム盤を表示 */}
        <Grid grid={displayGrid} />
      </div>
      <div className="side_container">
        {/* <div className="next_container">
          <p>Next</p>
          <div id="next_tetromino" className="next_tetromino_box"></div>
        </div> */}
        {/* <div className="score">
          <p>Score</p>
          <p id="score">0</p>
        </div> */}
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

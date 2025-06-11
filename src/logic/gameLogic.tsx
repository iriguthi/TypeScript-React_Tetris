// import Grid from "../components/Grid";
import { Tetromino, gridWidth, TETROMINOS } from "../components/Tetromino";
import { canMove } from "./TetrominoLogic";

// 盤面初期化
export function initialGrid() {
  return Array.from({ length: 20 }, () => Array(10).fill(0));
}

// テトロミノ生成
// 7種のテトロミノをランダムで生成
export function randomTetromino(): Tetromino {
  const random = Math.floor(Math.random() * TETROMINOS.length);
  const tetromino = {...TETROMINOS[random]};

  // 中央で生成
  const tetrominoWidth = tetromino.shape[0]?.length ?? 1;
  tetromino.x = Math.floor((gridWidth - tetrominoWidth) / 2);
  return tetromino;
}

// テトロミノ落下(1秒ごとにY座標1ずつ落下)
export function dropTetromino(
  grid: number[][],
  setGrid: React.Dispatch<React.SetStateAction<number[][]>>,
  tetromino: Tetromino,
  setTetromino: React.Dispatch<React.SetStateAction<Tetromino>>,
  setShouldGenerateNewTetromino: React.Dispatch<React.SetStateAction<boolean>>,
) {
  if (canMove(grid, tetromino, 0, 1)) {
    // 移動可能なら落下させる
    setTetromino(prev =>({...prev, y:prev.y + 1}));
  } else {
    // 固定処理
    const upDateGrid = grid.map(row => [...row]);
    tetromino.shape.forEach((row, dy) => {
      row.forEach((cell, dx) => {
        if (cell) {
          const x = tetromino.x + dx;
          const y = tetromino.y + dy;
          if (y >= 0 && y < upDateGrid.length && x >= 0 && x < upDateGrid[0].length) {
            upDateGrid[y][x] = tetromino.colorCode;
          }
        }
      });
    });

    const { newGrid } = clearLine(upDateGrid);
    // グリッドを更新
    setGrid(newGrid);
    setShouldGenerateNewTetromino(true);
  }
}

// 次のテトロミノを生成
export function nextTetromino(
  setTetromino: React.Dispatch<React.SetStateAction<Tetromino>>,
  setShouldGenerateNewTetromino: React.Dispatch<React.SetStateAction<boolean>>,
) {
  setTetromino(randomTetromino());
  setShouldGenerateNewTetromino(false);
}

// 揃ったラインの削除
let score = 0
export function clearLine(grid: number[][]):{
  newGrid: number[][],
  lineClear: number,
} {
  // 揃った列を検知
  const keepGrid = grid.filter(row => row.some(cell => cell === 0));
  const lineClear = grid.length - keepGrid.length;

  if (lineClear === 4){
    score = (lineClear * 1.5) * 100;
  } else {
    score += lineClear * 100;
  }
  // console.log(score)
  document.getElementById("score")!.innerText =  `${score}`

  // 盤面の削除した分を追加
  const newRenderGrid = Array.from({length: lineClear},() =>
  Array(grid[0].length).fill(0));

  const newGrid = [...newRenderGrid, ... keepGrid];

  return {newGrid, lineClear};
}

// import Grid from "../components/Grid";
import { Tetromino, gridWidth, TETROMINOS } from "../components/Tetromino";
import { canMove } from "./TetrominoLogic";

// ゲーム全体のステータス
export type GameState = "playing" | "paused" | "over";

// 盤面初期化
export function initialGrid() {
  return Array.from({ length: 20 }, () => Array(10).fill(0));
}

// テトロミノ生成
// 7種のテトロミノをランダムで生成
export function randomTetromino(): Tetromino {
  const random = Math.floor(Math.random() * TETROMINOS.length);
  // const random = 1
  const tetromino = {...TETROMINOS[random]};

  // 中央で生成
  const tetrominoWidth = tetromino.shape[0]?.length ?? 1;
  tetromino.x = Math.floor((gridWidth - tetrominoWidth) / 2);
  // tetromino.y = -2
  return tetromino;
}

// インターバルを設定
// let interval = 1000;
export function dropInterval() {
  // スコア1000pt毎に100msずつインターバルを更新
  return Math.max(1000 - Math.floor(score / 1000) * 100, 100);
  // console.log(interval)
}

// ゲームフラグを用意
let gameFlg = false
export function gamesFlg(){
  if(!gameFlg) {
    return gameFlg = true
  } else {
    return gameFlg = false
  }
}
// 一時停止
export let ispaused = false
export function pause(
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
) {
  if(ispaused) {
    setGameState('playing');
    ispaused = false;
  } else {
    setGameState('paused');
    ispaused = true;
  }
}

// テトロミノ落下(1秒ごとにY座標1ずつ落下)
export function dropTetromino(
  grid: number[][],
  setGrid: React.Dispatch<React.SetStateAction<number[][]>>,
  currentTetromino: Tetromino,
  setTetromino: React.Dispatch<React.SetStateAction<Tetromino>>,
  setShouldGenerateNewTetromino: React.Dispatch<React.SetStateAction<boolean>>,
) {
  // console.log(grid)
  if (canMove(grid, currentTetromino, 0, 1)) {
    // 移動可能なら落下させる
    setTetromino(prev =>({...prev, y:prev.y + 1}));
  } else {
    // 固定処理
    const upDateGrid = grid.map(row => [...row]);
    currentTetromino.shape.forEach((row, dy) => {
      row.forEach((cell, dx) => {
        if (cell) {
          const x = currentTetromino.x + dx;
          const y = currentTetromino.y + dy;
          if (y >= 0 && y < upDateGrid.length && x >= 0 && x < upDateGrid[0].length) {
            upDateGrid[y][x] = currentTetromino.colorCode;
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

// テトロミノ生成個所に既にテトロミノが存在していないか
export function spawnCollision(
  grid: number[][],
  nextTetromino: Tetromino,
) {
  for (let y = 0; y < nextTetromino.shape.length; y++ ) {
    for (let x = 0; x <nextTetromino.shape[y].length; x++ ) {
      if (nextTetromino.shape[y][x] !== 0 && grid[nextTetromino.y + y][nextTetromino.x + x] !== 0) {
        // 既に生成場所にテトロミノがあるかつ盤面が埋まってるときtrueで返す
        return true
      }
    }
  }
  return false
}

// 次のテトロミノを生成
export function nextTetromino(
  grid: number[][],
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  setTetromino: React.Dispatch<React.SetStateAction<Tetromino>>,
  setShouldGenerateNewTetromino: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const newTetromino = randomTetromino();
  if(spawnCollision(grid, newTetromino)) {
    // 既に生成場所にテトロミノがある場合
    alert("GAME OVER");
    setGameState('over');
  } else {
    setTetromino(newTetromino);
    setShouldGenerateNewTetromino(false);
  }
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
    console.log(lineClear)
    score += lineClear * 1.5 * 100;
  } else if (lineClear === 3) {
    console.log(lineClear)
    score += lineClear * 1.4 * 100;
  } else if (lineClear === 2) {
    console.log(lineClear)
    score += lineClear * 1.3 * 100;
  } else {
    score += lineClear * 100;
  }
  score = Math.floor(score);
  // console.log(score)
  document.getElementById("score")!.innerText = `${score}`

  // 盤面の削除した分を追加
  const newRenderGrid = Array.from({length: lineClear},() =>
  Array(grid[0].length).fill(0));

  const newGrid = [...newRenderGrid, ... keepGrid];

  return {newGrid, lineClear};
}

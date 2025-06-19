// import Grid from "../components/Grid";
import { Tetromino, TETROMINOS, TetrominoType } from "../components/Tetromino";
import { canMove } from "./TetrominoLogic";

// ゲーム全体のステータス
export type GameState = "playing" | "paused" | "over";

// 盤面初期化
export function initialGrid() {
  return Array.from({ length: 20 }, () => Array(10).fill(0));
}

// インターバルを設定
export let interval = 1000;
export function dropInterval(score: number) {
  // スコア1000pt毎に100msずつインターバルを更新
  interval = Math.max(1000 - Math.floor(score / 1000) * 100, 100);
  // console.log(interval)
  return interval
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

// ゲームオーバー
export function gameOver(
  gameState: GameState
) {
  if(gameState === 'over') alert('GAME OVER');
}

// テトロミノ落下(1秒ごとにY座標1ずつ落下)
export function dropTetromino(
  grid: number[][],
  setGrid: React.Dispatch<React.SetStateAction<number[][]>>,
  currentTetromino: Tetromino,
  setTetromino: React.Dispatch<React.SetStateAction<Tetromino>>,
  setShouldGenerateNewTetromino: React.Dispatch<React.SetStateAction<boolean>>,
  isPressedRef: React.RefObject<boolean>,
) {
  // console.log(grid)
  // console.log(isPressedRef.current, performance.now())
  if (isPressedRef.current) {
    isPressedRef.current = false;
    return
  } else {
    drop(grid, setGrid, currentTetromino, setTetromino,setShouldGenerateNewTetromino);
  };
}

// 落下処理(インターバル落下でも使用するためこちらに記載)
export function drop(
  grid: number[][],
  setGrid: React.Dispatch<React.SetStateAction<number[][]>>,
  currentTetromino: Tetromino,
  setTetromino: React.Dispatch<React.SetStateAction<Tetromino>>,
  setShouldGenerateNewTetromino: React.Dispatch<React.SetStateAction<boolean>>,
) {
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
    // console.log("drop fired", performance.now());
    const { newGrid } = clearLine(upDateGrid);
    // グリッドを更新
    setGrid(newGrid);
    requestGenerate(setShouldGenerateNewTetromino)
    // setShouldGenerateNewTetromino(true);

    // テトロミノが設置されたときにfalse戻す
    isHold = false;
  }
}

function requestGenerate(
  setShouldGenerateNewTetromino: React.Dispatch<React.SetStateAction<boolean>>,
) {
  setShouldGenerateNewTetromino(prev => (prev ? prev : true));
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
    // console.log(lineClear)
    score += lineClear * 1.5 * 100;
  } else if (lineClear === 3) {
    // console.log(lineClear)
    score += lineClear * 1.4 * 100;
  } else if (lineClear === 2) {
    // console.log(lineClear)
    score += lineClear * 1.3 * 100;
  } else {
    score += lineClear * 100;
  }
  score = Math.floor(score);
  dropInterval(score);
  // console.log(score)
  document.getElementById("score")!.innerText = `${score}`

  // 盤面の削除した分を追加
  const newRenderGrid = Array.from({length: lineClear},() =>
  Array(grid[0].length).fill(0));

  const newGrid = [...newRenderGrid, ... keepGrid];

  return {newGrid, lineClear};
}

// ホールド機能
export function holdTetromino(
  currentTetromino: Tetromino,
  setCurrentTetromino: React.Dispatch<React.SetStateAction<Tetromino>>,
  HoldTetromino: Tetromino | null,
  setHoldTetromino: React.Dispatch<React.SetStateAction<Tetromino | null>>,
  TetrominoDisplay: Tetromino,
){

  function getInitialTetrominoShape(type: TetrominoType): Tetromino {
    const tetromino = TETROMINOS.find(t => t.type === type);
    // nullが来る場合の考慮non-null使わない場合は下記をコメントインする
    // if (!tetromino) throw new Error("Invalid tetromino type: " + type);
    return tetromino!;
  }

  hold()
  const holdTetromino = getInitialTetrominoShape(currentTetromino.type)
  if(!HoldTetromino) {
    setHoldTetromino(holdTetromino);
    setCurrentTetromino(TetrominoDisplay);
  } else {
    setCurrentTetromino({
      shape: HoldTetromino.shape,
      colorCode: HoldTetromino.colorCode,
      x: Math.floor(10 / 2) - Math.ceil(HoldTetromino.shape[0].length / 2),
      y: HoldTetromino.y,
      type: currentTetromino.type,
    });
    setHoldTetromino(holdTetromino);
  }
}

// 複数回ホールドできないように制御する
// 一度ホールドしたらテトロミノが設置されるまでは不可
export let isHold = false
export function hold(){
  if(isHold) {
    isHold = false
  } else {
    isHold = true;
  }
}
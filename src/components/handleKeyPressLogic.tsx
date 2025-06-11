import { canMove } from "./TetrominoLogic";
import { Tetromino } from "./Tetromino";

// 操作系
export function handleKeyPressLogic(
  event: KeyboardEvent,
  currentTetromino: Tetromino,
  setCurrentTetromino: React.Dispatch<React.SetStateAction<Tetromino>>,
  grid: number[][],
) {
  switch (event.key) {
    case "ArrowLeft":
      // 左移動
      if (canMove(grid, currentTetromino, -1, 0)) {
        setCurrentTetromino(prev => ({...prev, x: prev.x -1}));
      }
      break;
    case "ArrowRight":
      // 右移動
      if (canMove(grid, currentTetromino, 1, 0)) {
        setCurrentTetromino(prev => ({...prev, x: prev.x +1}));
      }
      break;
    case "ArrowUp":
      // 回転
      console.log('上')
      break;
    case "ArrowDown":
      // 右移動
      if (canMove(grid, currentTetromino, 0, 1)) {
        setCurrentTetromino(prev => ({...prev, y: prev.y +1}));
      }
      break;

    default:
    break;
  }
}
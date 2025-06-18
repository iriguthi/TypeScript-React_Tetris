import { canMove, canRotate, rotateTetromino } from "./TetrominoLogic";
import { Tetromino } from "../components/Tetromino";
import { GameState, pause, ispaused, holdTetromino, isHold} from "./gameLogic";

// 操作中かどうか
export let isPressed = false
// 操作系
export function handleKeyPressLogic(
  event: KeyboardEvent,
  currentTetromino: Tetromino,
  setCurrentTetromino: React.Dispatch<React.SetStateAction<Tetromino>>,
  grid: number[][],
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  HoldTetromino: Tetromino | null,
  setHoldTetromino: React.Dispatch<React.SetStateAction<Tetromino | null>>,
  TetrominoDisplay: Tetromino,
  isPressedRef: React.RefObject<boolean>,
) {
  isPressedRef.current = true;
  switch (event.key) {
    case "ArrowLeft":
      // 左移動
      if (canMove(grid, currentTetromino, -1, 0) && !ispaused) {
        setCurrentTetromino(prev => ({...prev, x: prev.x -1}));
      }
      break;
    case "ArrowRight":
      // 右移動
      if (canMove(grid, currentTetromino, 1, 0) && !ispaused) {
        setCurrentTetromino(prev => ({...prev, x: prev.x +1}));
      }
      break;
    case "ArrowUp":
      // 回転
      if (canRotate(grid, currentTetromino) && !ispaused) {
        const rotated = rotateTetromino(grid, currentTetromino)
        setCurrentTetromino(rotated);
      }
      break;
    case "ArrowDown":
      // 右移動
      if (canMove(grid, currentTetromino, 0, 1) && !ispaused) {
        setCurrentTetromino(prev => ({...prev, y: prev.y +1}));
      }
      break;
      case " ":
        pause(setGameState);
        break

      case "Shift":
        if(!isHold && !ispaused) {
          holdTetromino(currentTetromino, setCurrentTetromino, HoldTetromino, setHoldTetromino, TetrominoDisplay);
        }
        break

    default:
    break;
  }
  isPressedRef.current = false;
}
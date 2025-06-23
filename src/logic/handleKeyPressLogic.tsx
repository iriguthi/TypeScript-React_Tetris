import { rotateTetromino, move } from "./TetrominoLogic";
import { Tetromino } from "../components/Tetromino";
import { GameState, pause, ispaused, holdTetromino, isHold, drop} from "./gameLogic";

// 操作中かどうか
export let isPressed = false

// 操作系
export function handleKeyPressLogic(
  event: KeyboardEvent,
  currentTetromino: Tetromino,
  setCurrentTetromino: React.Dispatch<React.SetStateAction<Tetromino>>,
  grid: number[][],
  setGrid: React.Dispatch<React.SetStateAction<number[][]>>,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  HoldTetromino: Tetromino | null,
  setHoldTetromino: React.Dispatch<React.SetStateAction<Tetromino | null>>,
  TetrominoDisplay: Tetromino,
  isPressedRef: React.RefObject<boolean>,
  setShouldGenerateNewTetromino: React.Dispatch<React.SetStateAction<boolean>>,
) {
  switch (event.key) {
    case "ArrowLeft":
      // 左移動
      if (!ispaused) {
        move(grid, currentTetromino, setCurrentTetromino, -1 , 0)
      }
      break;
    case "ArrowRight":
      // 右移動
      if (!ispaused) {
        move(grid, currentTetromino, setCurrentTetromino, 1 , 0)
      }
      break;
    case "ArrowUp":
      // 回転
      if (!ispaused) {
        rotateTetromino(grid, currentTetromino, setCurrentTetromino)
      }
      break;
    case "ArrowDown":
      // 下移動
      isPressedRef.current = true;
      if (!ispaused) {
        drop(grid, setGrid, currentTetromino, setCurrentTetromino, setShouldGenerateNewTetromino)
      }
      break;
      case " ":
        // 一時停止
        pause(setGameState);
        break

      case "Shift":
        // ホールド
        if(!isHold && !ispaused) {
          holdTetromino(currentTetromino, setCurrentTetromino, HoldTetromino, setHoldTetromino, TetrominoDisplay);
        }
        break

    default:
    break;
  }
}
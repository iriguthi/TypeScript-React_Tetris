import { gridWidth, Tetromino, TETROMINOS } from "../components/Tetromino";
import { GameState } from "./gameLogic";


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

// 次のテトロミノを生成
export function nextTetromino(
  grid: number[][],
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  setTetromino: React.Dispatch<React.SetStateAction<Tetromino>>,
  setShouldGenerateNewTetromino: React.Dispatch<React.SetStateAction<boolean>>,
  TetrominoDisplay: Tetromino,
  setTetrominoDisplay: React.Dispatch<React.SetStateAction<Tetromino>>,
) {
  if(spawnCollision(grid, TetrominoDisplay)) {
    // 既に生成場所にテトロミノがある場合
    setGameState('over');
  } else {
    setTetromino(TetrominoDisplay);
    setTetrominoDisplay(randomTetromino());
    setShouldGenerateNewTetromino(false);
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

// テトロミノ移動可否
export function canMove(
  grid: number[][],
  tetromino: Tetromino,
  dx: number,
  dy: number,
): boolean {
  return tetromino.shape.every((row, dyoffset) => {
    return row.every((value, dxoffset) => {
      if (value === 0) return true;

      const x = tetromino.x + dxoffset + dx;
      const y = tetromino.y + dyoffset + dy;

      // 範囲チェック
      if(x < 0 || x >= grid[0].length || y >= grid.length) {
        return false;
      }

      // ブロックとの衝突
      if(grid[y]?.[x] !== 0) {
        // console.log("テトロミノ衝突")
        return false;
      }

      return true;
    });
  });
}

// テトロミノ移動(左右)
export function move(
  grid: number[][],
  currentTetromino: Tetromino,
  setTetromino: React.Dispatch<React.SetStateAction<Tetromino>>,
  dx: number,
  dy: number,
) {
  if (canMove(grid, currentTetromino, dx, dy)) {
    // 移動可能なら落下させる
    setTetromino(prev =>({...prev, x:prev.x + dx}));
  }
}

// テトロミノ回転可否
export function canRotate(
  grid: number[][],
  newMatrix: number[][],
  tetromino: Tetromino,
): boolean {
  return newMatrix.every((row, dy) => {
    return row.every((value, dx) => {
      if (value === 0) return true;

      const x = tetromino.x + dx;
      const y = tetromino.y + dy;

      // 範囲チェック
      if(x < 0 || x >= grid[0].length || y >= grid.length) {
        return false;
      }

      // ブロックとの衝突
      if(grid[y]?.[x] !== 0) {
        // console.log("テトロミノ衝突")
        return false;
      }

      return true;
    });
  });
}

// テトロミノ回転
export function rotateTetromino(
  grid: number[][],
  tetromino: Tetromino,
  setCurrentTetromino: React.Dispatch<React.SetStateAction<Tetromino>>,
) {
  const newMatrix = rotateMatrix(tetromino.shape);

  if (canRotate(grid, newMatrix, tetromino)) {
    return setCurrentTetromino({
      ...tetromino,
      shape: newMatrix,
    })
  }

  return setCurrentTetromino(tetromino);
}

// テトロミノ回転(時計回り)
function rotateMatrix(matrix: number[][]): number[][] {
  if(matrix.length === 0) {
    return []
  }
  return matrix[0]!.map((_, colIndex) =>
    matrix.map(row => row[colIndex] ?? 0).reverse()
  );
}

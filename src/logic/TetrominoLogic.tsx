import { Tetromino } from "../components/Tetromino";

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

// テトロミノ回転可否
export function canRotate(
  grid: number[][],
  tetromino: Tetromino,
): boolean {
  const newMatrix = rotateMatrix(tetromino.shape);
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
) {
  const newMatrix = rotateMatrix(tetromino.shape);

  if (canRotate(grid, {...tetromino, shape: newMatrix})) {
    return {
      ...tetromino,
      shape: newMatrix,
    }
  }

  return tetromino
}

// テトロミノ回転(時計回り)
// どちらを本採用するか迷い中
function rotateMatrix(matrix: number[][]): number[][] {
  const mtrlength = matrix.length;
  const newShape = Array.from({ length: mtrlength }, () => Array(mtrlength).fill(0));
  for (let y = 0; y < mtrlength; y++) {
    for (let x = 0; x < mtrlength; x++) {
      newShape[x][mtrlength - 1 - y] = matrix[y][x];
    }
  }
  console.log(newShape);
  return newShape;
}

// function rotateMatrix(matrix: number[][]): number[][] {
//   if(matrix.length === 0) {
//     return []
//   }
//   return matrix[0]!.map((_, colIndex) =>
//     matrix.map(row => row[colIndex] ?? 0).reverse()
//   );
// }

import { Tetromino } from "./Tetromino";

// テトロミノ移動可否
export function canMove(
  grid: number[][],
  tetromino: Tetromino,
  dx: number,
  dy: number,
): boolean {
  return tetromino.shape.every((row, dyOffset) => {
    return row.every((value, dxoffSet) => {
      if (value === 0) return true;

      const x = tetromino.x + dxoffSet + dx;
      const y = tetromino.y + dyOffset + dy;

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

// 操作系
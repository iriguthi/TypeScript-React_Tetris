export interface Tetromino {
  shape: number[][],
  x: number,
  y: number,
  colorCode: number,
}

export const gridWidth = 10;
export const gridHeight = 20;

// テトロミノ定義
// テトロミノの色はGrid.css内のfilled-〇に合わせる
export const TETROMINOS: Tetromino[] = [
  // O
  {shape: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0],
  ], x: 0, y: 0, colorCode: 4 },
  // I
  {shape: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ], x: 0, y: 0, colorCode: 1 },
  // Z
  {shape: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0],
  ], x: 0, y: 0, colorCode: 7 },
  // S
  {shape: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0],
  ], x: 0, y: 0, colorCode: 5 },
  // T
  {shape: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
  ], x: 0, y: 0, colorCode: 6 },
  // L
  {shape: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
  ], x: 0, y: 0, colorCode: 3 },
  // 逆L
  {shape: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
  ], x: 0, y: 0, colorCode: 2 },
];
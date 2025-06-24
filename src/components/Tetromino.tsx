export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export interface Tetromino {
  shape: number[][],
  x: number,
  y: number,
  colorCode: number,
  type: TetrominoType,
}

export const gridWidth = 10;
export const gridHeight = 20;

// テトロミノ定義
// テトロミノの色はGrid.css内のfilled-〇に合わせる
export const TETROMINOS: Tetromino[] = [
  // O
  {shape: [
    [1, 1],
    [1, 1],
  ], x: 0, y: 0, colorCode: 4, type: 'O' },
  // I
  {shape: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ], x: 0, y: -1, colorCode: 1, type: 'I' },
  // Z
  {shape: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ], x: 0, y: 0, colorCode: 7, type: 'Z' },
  // S
  {shape: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ], x: 0, y: 0, colorCode: 5, type: 'S' },
  // T
  {shape: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0]
  ], x: 0, y: 0, colorCode: 6, type: 'T' },
  // L
  {shape: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0]
  ], x: 0, y: 0, colorCode: 3, type: 'J' },
  // J
  {shape: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0]
  ], x: 0, y: 0, colorCode: 2, type: 'L' },
];
import './css/TetrominoDisplay.css'

type Props = {
  shape: number[][],
  colorCode: number
};

function TetrominoDisplay({ shape, colorCode }: Props) {
  return (
    <div
      className="next-tetromino"
      style={{
        gridTemplateColumns: `repeat(${shape[0].length}, 20px)`,
      }}
    >
      {shape.map((row, y) =>
        row.map((cell, x) =>
          cell !== 0 ? (
            <div
              key={`${y}-${x}`}
              className={`filled filled-${colorCode}`}
            />
          ) : (
            <div
              key={`${y}-${x}`}
              style={{ width: "20px", height: "20px" }}
            />
          )
        )
      )}
    </div>
  );
}

export default TetrominoDisplay;
// import React from "react";
import './css/Grid.css'

type Props = {
  grid: number[][],
};

function Grid({grid}: Props) {
  return (
    <div className="grid">
      {grid.map((row, y) => (
        <div key={y} className="grid-row">
          {row.map((cell, x) => (
            <div
              key={x}
              className={`grid-cell ${cell !== 0 ? `filled filled-${cell}` : ""}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Grid;
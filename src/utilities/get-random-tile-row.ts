import { getRandomTile } from "./get-random-tile";
import { Tile } from "../types";

export const getRandomTileRow = () => {
  const randomTilesRow: Tile[] = [];
  for (let i = 0; i < 3; i++) {
    const randomTile = getRandomTile();
    randomTilesRow.push(randomTile);
  }
  return randomTilesRow;
};

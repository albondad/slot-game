import { getRandomTileValue } from "./get-random-tile-value";

export const getRandomTile = () => {
  const randomTileValue = getRandomTileValue();
  const randomTile = {
    value: randomTileValue,
  };
  return randomTile;
};

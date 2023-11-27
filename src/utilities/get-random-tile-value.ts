export const getRandomTileValue = () => {
  const randomValue = Math.random();
  const randomTileValue = randomValue <= 0.5 ? "x" : "o";
  return randomTileValue;
};

export const getTileValueByTileTexture = (tileValue) => {
  let tileTexture = "";

  switch (tileValue) {
    case "o":
      tileTexture = "oImage";
      break;
    case "x":
      tileTexture = "xImage";
      break;
  }

  return tileTexture;
};

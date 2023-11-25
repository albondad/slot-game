import * as Phaser from "phaser";

const gameWidth = 1280;
const gameHeight = 720;
const gameXCenter = gameWidth / 2;

export default class MainScene extends Phaser.Scene {
  startTime: Number;
  tempSprite: Phaser.GameObjects.Sprite;

  constructor() {
    super("mainScene");
  }

  preload() {
    this.load.image("bottomBarImage", "assets/bottom-bar.png");
    this.load.image("buttonImage", "assets/button.png");
    this.load.image("oImage", "assets/o.png");
    this.load.image("topBarImage", "assets/top-bar.png");
    this.load.image("xImage", "assets/x.png");
  }

  create() {
    // set bup bar sprite layer
    const topBarSprite = this.add.sprite(0, 0, "topBarImage");
    topBarSprite.setOrigin(0, 0);

    const bottomBarSprite = this.add.sprite(0, 0, "bottomBarImage");
    bottomBarSprite.setOrigin(0, 0);
    bottomBarSprite.setY(448);

    const barSpriteLayer = this.add.layer();

    barSpriteLayer.add(topBarSprite);
    barSpriteLayer.add(bottomBarSprite);

    barSpriteLayer.setVisible(true);

    const goButtonSprite = this.add
      .sprite(gameXCenter, 592, "buttonImage")
      .setInteractive();

    let boardTiles = [[""]];

    goButtonSprite.on("pointerup", () => {
      // populate tiles
      const boardSize = 3;
      let tileY = 128;
      for (let rowIndex = 0; rowIndex < boardSize; rowIndex++) {
        let tileX = 512;
        boardTiles[rowIndex] = [];
        for (let columnIndex = 0; columnIndex < boardSize; columnIndex++) {
          const tileValue = Math.random() < 0.5 ? "x" : "o";
          boardTiles[rowIndex][columnIndex] = tileValue;
          if (tileValue === "x") {
            this.add.sprite(tileX, tileY, "xImage");
          } else {
            this.add.sprite(tileX, tileY, "oImage");
          }
          tileX += 128;
        }
        tileY += 128;
      }

      // check matches
      // check horizontal matches
      const matches = [];
      for (let row = 0; row < boardSize; row++) {
        let isMatchingRow = true;
        for (let column = 1; column < boardSize; column++) {
          if (boardTiles[row][column] !== boardTiles[row][column - 1]) {
            isMatchingRow = false;
          }
        }
        if (isMatchingRow) {
          matches.push(`row ${row + 1} is a match`);
        }
      }

      // check for vertical matches
      for (let column = 0; column < boardSize; column++) {
        let isMatchingColumn = true;
        for (let row = 1; row < boardSize; row++) {
          if (boardTiles[row][column] !== boardTiles[row - 1][column]) {
            isMatchingColumn = false;
          }
        }
        if (isMatchingColumn) {
          matches.push(`column ${column + 1} is a match`);
        }
      }

      // check for top-left to bottom-right diagonal match
      let hasTopLeftToBottomRight = true;
      for (let index = 1; index < boardSize; index++) {
        if (boardTiles[index][index] !== boardTiles[index - 1][index - 1]) {
          hasTopLeftToBottomRight = false;
        }
      }
      if (hasTopLeftToBottomRight) {
        matches.push("has top left to bottom right match");
      }

      // check for bottom-left to top-right diagonal match
      let hasBottomLeftToTopRightMatch = true;
      for (let index = 1; index < boardSize; index++) {
        if (
          boardTiles[boardSize - 1 - index][index] !==
          boardTiles[boardSize - index][index - 1]
        ) {
          hasBottomLeftToTopRightMatch = false;
        }
      }
      if (hasBottomLeftToTopRightMatch) {
        matches.push("has bottom left to top right match");
      }

      console.log(boardTiles);
      console.log(matches);
    });

    this.tempSprite = this.add.sprite(120, 120, "xImage");
  }

  update() {
    if (this.tempSprite.y <= 512) {
      this.tempSprite.y += 50;
    }
  }
}

const config = {
  type: Phaser.AUTO,
  backgroundColor: "#000000",
  width: gameWidth,
  height: gameHeight,
  scene: MainScene,
};

const game = new Phaser.Game(config);

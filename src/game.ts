import * as Phaser from "phaser";
import { Tile } from "./types";

const gameWidth = 1280;
const gameHeight = 720;
const gameXCenter = gameWidth / 2;

export default class MainScene extends Phaser.Scene {
  barSpritesLayer: Phaser.GameObjects.Layer;
  goButtonSpriteLayer: Phaser.GameObjects.Layer;
  tileRows: Tile[][] = [];
  tileSpritesGroup: Phaser.GameObjects.Group;
  tileSpritesLayer: Phaser.GameObjects.Layer;

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
    this.setupLayers();
    this.setupGroups();
    this.setupBarSprites();
    this.setupGoButtonSprite();
    this.setUpTileRows();
  }

  update() {
    this.updateTileSpritesPosition();
  }

  setupGroups() {
    this.tileSpritesGroup = this.add.group();
  }

  setupLayers() {
    this.tileSpritesLayer = this.add.layer();
    this.tileSpritesLayer.setDepth(1);
    this.barSpritesLayer = this.add.layer();
    this.barSpritesLayer.setDepth(2);
    this.goButtonSpriteLayer = this.add.layer();
    this.goButtonSpriteLayer.setDepth(3);
  }

  setupBarSprites() {
    const topBarSprite = this.add.sprite(0, 0, "topBarImage");
    topBarSprite.setOrigin(0, 0);

    const bottomBarSprite = this.add.sprite(0, 0, "bottomBarImage");
    bottomBarSprite.setOrigin(0, 0);
    bottomBarSprite.setY(448);

    this.barSpritesLayer.add(topBarSprite);
    this.barSpritesLayer.add(bottomBarSprite);
  }

  setupGoButtonSprite() {
    const goButtonSprite = this.add.sprite(0, 0, "buttonImage");
    goButtonSprite.setOrigin(0, 0);
    goButtonSprite.setInteractive();
    const newGoButtonSpriteX = gameXCenter - goButtonSprite.width / 2;
    const newGoButtonSpriteY = 528;
    goButtonSprite.setPosition(newGoButtonSpriteX, newGoButtonSpriteY);

    goButtonSprite.on(Phaser.Input.Events.POINTER_OVER, () => {
      goButtonSprite.setAlpha(0.75);
    });

    goButtonSprite.on(Phaser.Input.Events.POINTER_DOWN, () => {
      goButtonSprite.setAlpha(0.5);
      this.refreshTileRows();
      this.refreshTileSprites();
    });

    goButtonSprite.on(Phaser.Input.Events.POINTER_UP, () => {
      goButtonSprite.setAlpha(0.75);
    });

    goButtonSprite.on(Phaser.Input.Events.POINTER_OUT, () => {
      goButtonSprite.setAlpha(1);
    });

    this.goButtonSpriteLayer.add(goButtonSprite);
  }

  refreshTileSprites() {
    this.tileSpritesGroup.children.each((child) => {
      child.destroy();
      return true;
    });
    let spriteY = 320 - (this.tileRows.length - 1) * 128;

    this.tileRows.forEach((tileRow) => {
      let spriteX = 448;

      tileRow.forEach((tile) => {
        const spriteTexture = this.getTileValueByTileTexture(tile.value);
        const sprite = this.add.sprite(0, 0, spriteTexture);
        sprite.setOrigin(0, 0);
        sprite.setPosition(spriteX, spriteY);
        this.tileSpritesGroup?.add(sprite);
        this.tileSpritesLayer?.add(sprite);
        spriteX += 128;
      });

      spriteY += 128;
    });
  }

  updateTileSpritesPosition() {
    console.log();
    this.tileSpritesGroup?.children.iterate((child, index) => {
      const isFirstRow = index === 0 || index === 1 || index === 2;
      const isSecondRow = index === 3 || index === 4 || index === 5;
      const isThirdRow = index === 6 || index === 7 || index === 8;
      const isOtherRow = index >= 9;

      const childAsSprite = child as Phaser.GameObjects.Sprite;

      if (isFirstRow && childAsSprite.y < 64) {
        childAsSprite.y += 64;
      } else if (isSecondRow && childAsSprite.y < 192) {
        childAsSprite.y += 64;
      } else if (isThirdRow && childAsSprite.y < 320) {
        childAsSprite.y += 64;
      } else if (isOtherRow && childAsSprite.y <= 448) {
        childAsSprite.y += 64;
      }

      return true;
    });
  }

  refreshTileRows() {
    const newTileRows = [];
    for (let i = 0; i < 27; i++) {
      const randomTileRow = this.getRandomTileRow();
      newTileRows.push(randomTileRow);
    }
    for (let i = 0; i < 3; i++) {
      const oldTileRow = this.tileRows[i];
      newTileRows.push(oldTileRow);
    }
    this.tileRows = newTileRows;
  }

  setUpTileRows() {
    for (let i = 0; i < 3; i++) {
      const randomTileRow = this.getRandomTileRow();
      this.tileRows.push(randomTileRow);
    }
  }

  getRandomTileRow() {
    const randomTilesRow: Tile[] = [];
    for (let i = 0; i < 3; i++) {
      const randomTile = this.getRandomTile();
      randomTilesRow.push(randomTile);
    }
    return randomTilesRow;
  }

  getRandomTile() {
    const randomTileValue = this.getRandomTileValue();
    const randomTile = {
      value: randomTileValue,
    };
    return randomTile;
  }

  getRandomTileValue() {
    const randomValue = Math.random();
    const randomTileValue = randomValue <= 0.5 ? "x" : "o";
    return randomTileValue;
  }

  getTileValueByTileTexture(tileValue) {
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

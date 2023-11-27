import * as Phaser from "phaser";
import { getRandomTileRow } from "./utilities/get-random-tile-row";
import { getTileValueByTileTexture } from "./utilities/get-tile-value-by-texture";

const gameWidth = 1280;
const gameHeight = 720;
const gameXCenter = gameWidth / 2;

export default class MainScene extends Phaser.Scene {
  barSpritesLayer;
  goButtonSpriteLayer;
  tileRows;
  tileSpritesGroup;
  tileSpritesLayer;

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
    const sprite = this.add.sprite(0, 0, "buttonImage");
    sprite.setOrigin(0, 0);
    sprite.setInteractive();
    const spriteX = gameXCenter - sprite.width / 2;
    const spriteY = 528;
    sprite.setPosition(spriteX, spriteY);

    sprite.on(Phaser.Input.Events.POINTER_OVER, () => {
      sprite.setAlpha(0.75);
    });

    sprite.on(Phaser.Input.Events.POINTER_DOWN, () => {
      sprite.setAlpha(0.5);
      this.refreshTileRows();
      this.refreshTileSprites();
    });

    sprite.on(Phaser.Input.Events.POINTER_UP, () => {
      sprite.setAlpha(0.75);
    });

    sprite.on(Phaser.Input.Events.POINTER_OUT, () => {
      sprite.setAlpha(1);
    });

    this.goButtonSpriteLayer.add(sprite);
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
        const spriteTexture = getTileValueByTileTexture(tile.value);
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
    this.tileSpritesGroup?.children.iterate((child, index) => {
      const isFirstRow = index === 0 || index === 1 || index === 2;
      const isSecondRow = index === 3 || index === 4 || index === 5;
      const isThirdRow = index === 6 || index === 7 || index === 8;
      const isOtherRow = index >= 9;

      if (isFirstRow && child.y < 64) {
        child.y += 64;
      } else if (isSecondRow && child.y < 192) {
        child.y += 64;
      } else if (isThirdRow && child.y < 320) {
        child.y += 64;
      } else if (isOtherRow && child.y <= 448) {
        child.y += 64;
      }

      return true;
    });
  }

  refreshTileRows() {
    const newTileRows = [];
    for (let i = 0; i < 27; i++) {
      const randomTileRow = getRandomTileRow();
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
      const randomTileRow = getRandomTileRow();
      this.tileRows.push(randomTileRow);
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

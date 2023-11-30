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
  highlightSpritesGroup;
  highlightSpritesLayer;
  shouldUpdateTileSprites;

  constructor() {
    super("mainScene");
  }

  preload() {
    this.load.image("bottomBarImage", "assets/bottom-bar.png");
    this.load.image("buttonImage", "assets/button.png");
    this.load.image("highlightImage", "assets/highlight.png");
    this.load.image("oImage", "assets/o.png");
    this.load.image("topBarImage", "assets/top-bar.png");
    this.load.image("xImage", "assets/x.png");
  }

  create() {
    this.shouldUpdateTileSprites = false;
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
    this.highlightSpritesGroup = this.add.group();
    this.tileSpritesGroup = this.add.group();
  }

  setupLayers() {
    this.tileSpritesLayer = this.add.layer();
    this.tileSpritesLayer.setDepth(1);

    this.highlightSpritesLayer = this.add.layer();
    this.highlightSpritesLayer.setDepth(2);

    this.barSpritesLayer = this.add.layer();
    this.barSpritesLayer.setDepth(3);

    this.goButtonSpriteLayer = this.add.layer();
    this.goButtonSpriteLayer.setDepth(4);
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
      this.validateTileMatches();
      this.resetHighlightSpritesGroup();
      this.refreshTileSprites();
    });

    sprite.on(Phaser.Input.Events.POINTER_UP, () => {
      sprite.setAlpha(0.75);
      this.shouldUpdateTileSprites = true;
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
    if (!this.shouldUpdateTileSprites) {
      return;
    }

    this.tileSpritesGroup?.children.iterate((child, index) => {
      const shouldFirstRowChildMove = index >= 0 && index <= 2 && child.y < 64;

      const shouldSecondRowChildMove =
        index >= 3 && index <= 5 && child.y < 192;

      const shouldThirdRowChildMove = index >= 6 && index <= 8 && child.y < 320;

      const shouldOtherRowChildMove = index >= 9 && child.y < 448;

      const shouldChildMove =
        shouldFirstRowChildMove ||
        shouldSecondRowChildMove ||
        shouldThirdRowChildMove ||
        shouldOtherRowChildMove;

      if (shouldChildMove) {
        child.y += 64;
      }

      if (index === 0 && child.y >= 64) {
        console.log(index, child.y);
        this.refreshHighlightSprites();
        this.shouldUpdateTileSprites = false;
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
    this.tileRows = [];
    for (let i = 0; i < 3; i++) {
      const randomTileRow = getRandomTileRow();
      this.tileRows.push(randomTileRow);
    }
  }

  validateTileMatches() {
    const messages = [];

    // validate horizontal match
    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
      let hasHorizontalMatch = true;

      for (let columnIndex = 1; columnIndex < 3; columnIndex++) {
        if (
          this.tileRows[rowIndex][columnIndex].value !==
          this.tileRows[rowIndex][columnIndex - 1].value
        ) {
          hasHorizontalMatch = false;
        }
      }

      if (hasHorizontalMatch) {
        messages.push(`there is a horizontal match in row ${rowIndex + 1}`);
        this.tileRows[rowIndex].forEach((element) => (element.isMatch = true));
      }
    }

    // validate vertical match
    for (let columnIndex = 0; columnIndex < 3; columnIndex++) {
      let hasVerticalMatch = true;

      for (let rowIndex = 1; rowIndex < 3; rowIndex++) {
        if (
          this.tileRows[rowIndex][columnIndex].value !==
          this.tileRows[rowIndex - 1][columnIndex].value
        ) {
          hasVerticalMatch = false;
        }
      }

      if (hasVerticalMatch) {
        messages.push(`there is a vertical match in column ${columnIndex + 1}`);

        for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
          this.tileRows[rowIndex][columnIndex].isMatch = true;
        }
      }
    }

    // validate top left to bottom right match
    let hasTopToBottomMatch = true;

    for (let index = 1; index < 3; index++) {
      if (
        this.tileRows[index][index].value !==
        this.tileRows[index - 1][index - 1].value
      ) {
        hasTopToBottomMatch = false;
      }
    }

    if (hasTopToBottomMatch) {
      messages.push(`there is a top left to bottom right match`);

      for (let index = 0; index < 3; index++) {
        this.tileRows[index][index].isMatch = true;
      }
    }

    // validate bottom left to top right match
    let hasBottomLeftToTopRightMatch = true;

    for (let index = 1; index < 3; index++) {
      if (
        this.tileRows[2 - index][index].value !==
        this.tileRows[3 - index][index - 1].value
      ) {
        hasBottomLeftToTopRightMatch = false;
      }
    }

    if (hasBottomLeftToTopRightMatch) {
      messages.push(`there is a bottom left to top right match`);

      for (let index = 0; index < 3; index++) {
        this.tileRows[2 - index][index].isMatch = true;
      }
    }
  }

  resetHighlightSpritesGroup() {
    this.highlightSpritesGroup.children.each((child) => {
      child.destroy();
      return true;
    });
  }

  refreshHighlightSprites() {
    let spriteY = 64;
    let spriteX = 448;

    this.tileRows.forEach((tileRow, index) => {
      if (index < 3) {
        tileRow.forEach((tile) => {
          if (tile.isMatch) {
            const sprite = this.add.sprite(spriteX, spriteY, "highlightImage");
            sprite.setOrigin(0, 0);
            this.highlightSpritesGroup?.add(sprite);
            this.highlightSpritesLayer?.add(sprite);
          }
          spriteX += 128;
        });
        spriteX = 448;
        spriteY += 128;
      }
    });
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

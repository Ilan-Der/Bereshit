import { tileSize, tileMap, isPause } from "../app.js";
import { calculateInterval } from "../core/utils.js";
import { mapSizeX, mapSizeY } from "./map.js";

export class SpawnPoint {
  constructor(x, y) {
    this.x = x * tileSize;
    this.y = y * tileSize;
    this.position = { x: x, y: y };
    this.lastGroundSpawn = 0;
    this.level = 1;
    this.monstersCount = 0;
    this.MaxmonstersCount = 1;

    this.img = new Image();
    this.img.src = "./src/images/spawnPoints.png";
    this.spriteSize = 32;
    this.frameX = 0;
    this.frameY = 0;
    this.minFrame = 0;
    this.maxFrame = this.horizontalFrame * this.verticalFrame;
    this.frameRate = 10;
    this.lastFrame = 0;
    this.isSpawning = false
  }
  update(ctx) {
    let timestamp = Date.now();

    const horizontalFrame = this.img.naturalWidth / 32;
    ctx.save();
    ctx.drawImage(
      this.img,
      this.frameX * this.spriteSize,
      this.frameY * this.spriteSize,
      this.spriteSize,
      this.spriteSize,
      this.x,
      this.y,
      tileSize,
      tileSize
    );

    this.isSpawning && !isPause ? this.drawSpawnAnimation(timestamp) : null;

    ctx.restore();
  }

  drawSpawnAnimation(timestamp){
    const horizontalFrame = this.img.naturalWidth / 32;

    if (calculateInterval(timestamp, this.lastFrame, 1000 / this.frameRate)) {
      if (this.frameX < horizontalFrame - 1) {
        this.frameX += 1;
      } else {
        this.frameX = 0;
        this.isSpawning = false;
      }
      this.lastFrame = timestamp;
    }
  }
}


import { tileSize, pixelUnit, particles, isPause } from "../../app.js";
import { BONUS } from "../../core/constants/bonus.js";
import { calculateInterval } from "../../core/utils.js";
import { Particle } from "../../player/visualEffects.js";

export class River {
  constructor(x, y, image) {
    this.x = x * tileSize;
    this.y = y * tileSize;
    this.position = { x, y };
    this.position = { x: x, y: y };
    this.type = "river";
    this.stats = {
      range: tileSize * 2.5,
    };
    this.img = image;
    this.spriteSize = 32;
    this.frameX = 0;
    this.frameY = 0;
    this.frameRate = 5;
    this.lastFrame = 0;
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
    if (
      calculateInterval(timestamp, this.lastFrame, 1000 / this.frameRate) &&
      !isPause
    ) {
      this.frameX = this.frameX < horizontalFrame - 1 ? this.frameX + 1 : 0;
      this.lastFrame = timestamp;
    }
    ctx.restore();
  }
}

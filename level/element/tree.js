import { tileSize, tileMap, pixelUnit, delta, gameScreen } from "../../app.js";
import { BONUS } from "../../core/constants/bonus.js";
import { calculateInterval } from "../../core/utils.js";

export class Tree {
  constructor(x, y, image) {
    this.x = x * tileSize;
    this.y = y * tileSize;
    this.image = image;
    this.position = { x: x, y: y };
    this.stats = {
      healthLoad: 0,
      maxHealth: 100,
      healthBonus: 1,
    };
    this.isAttack = false;
    this.lastUpdate = 0;
    this.healthsToFeed = [];

    this.crossHealth = new Image();
    this.crossHealth.src = "./src/images/healthCross.png";
  }

  update(ctx) {
    let timestamp = Date.now();
    this.drawLoadingHealth(ctx);
    if (
      calculateInterval(timestamp, this.lastUpdate, 50 + BONUS.TREE_COOLDOWN)
    ) {
      this.stats.healthLoad++;
      this.lastUpdate = timestamp;
    }
    if (this.stats.healthLoad > this.stats.maxHealth) {
      this.stats.healthLoad = 0;
      if (tileMap.players[0].stats.hp < tileMap.players[0].maxHp) {
        tileMap.players[0].stats.hp += this.stats.healthBonus + BONUS.TREE_FORCE;
      }
      const health = new HealthToFeed(this.x, this.y);
      this.healthsToFeed.push(health);
    }

    for (let i = 0; i < this.healthsToFeed.length; i++) {
      this.healthsToFeed[i].update(ctx);
      if (this.healthsToFeed[i].x >= this.healthsToFeed[i].targetX) {
        this.healthsToFeed.splice(i, 1);
        tileMap.players[0].stats.healthResource += this.stats.healthBonus + BONUS.TREE_FORCE;
        this.ishealthGenerated = false;
      }
    }
  }

  drawLoadingHealth(ctx) {
    const crossXPos = this.x + tileSize / 4;
    const crossYPos = this.y - tileSize / 4;
    const spriteSize = 16;
    const ratio = this.stats.healthLoad / this.stats.maxHealth;
    ctx.drawImage(
      this.crossHealth,
      0,
      spriteSize * ratio - spriteSize,
      spriteSize,
      spriteSize,
      crossXPos,
      crossYPos,
      tileSize / 2,
      tileSize / 2
    );
  }
}

class HealthToFeed {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.targetX = gameScreen.width;
    this.targetY = tileSize;
    this.velocity;
    this.speed = 3;
    this.crossHealth = new Image();
    this.crossHealth.src = "./src/images/healthCross.png";
  }

  update(ctx) {
    this.draw(ctx);
    const angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
    this.velocity = {
      x: Math.cos(angle) * 5,
      y: Math.sin(angle) * 5,
    };
    this.x += this.velocity.x * pixelUnit * delta * this.speed;
    this.y += this.velocity.y * pixelUnit * delta * this.speed;
  }

  draw(ctx) {
    ctx.drawImage(this.crossHealth, this.x, this.y, tileSize / 2, tileSize / 2);
  }
}

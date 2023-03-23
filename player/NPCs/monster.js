import {
  pixelUnit,
  delta,
  tileMap,
  tileSize,
  damageTexts,
  pauseDelta,
  isPause,
  soundMute,
} from "../../app.js";
import { deleteFromElementArray } from "../../level/element/bomb.js";
import { DrawDamage } from "../utils.js";
import { calculateInterval, speedFactor } from "../../core/utils.js";

import findPath from "./findPath.js";
import { MONSTERS_STATS } from "../../core/constants/monsters.js";
import { BONUS } from "../../core/constants/bonus.js";
import { ASSETS } from "../../core/loadAssets.js";

const bombArray = [];

export class Monster {
  constructor(x, y, radius, name, type) {
    this.x = x + tileSize / 2;
    this.y = y + tileSize / 2;
    this.radius = radius;
    this.name = name;
    this.type = type;
    this.velocity = { x: 0, y: 0 };
    this.stats = this.getMonsterStats();
    this.speed = this.stats.speed * 0.4;

    this.maxHp = this.stats.hp;

    this.visitedStars = [];

    this.isTakingDamage = false;
    this.damageFrameCount = 0;

    this.startVec = tileMap.getPosition(this.x, this.y);
    this.defaultTargetVec = tileMap.getPosition(
      tileMap.players[0].x,
      tileMap.players[0].y
    );
    this.targetVec = this.defaultTargetVec;
    this.isBombTarget = false;
    this.toDelete;
    this.ArrayToDelete;

    this.lastTargetVec = this.targetVec;
    this.path = findPath(this.startVec, this.targetVec, this.stats.type); // Create the path

    this.lastLavaDamage = 0;
    this.lavaCooldown = 1000;

    this.desertFactor = 0.5;

    this.distance = 0;
    this.position = tileMap.getPosition(this.x, this.y);

    this.moveToTarget = this.path ? this.path.shift() : null;

    this.hitBox = tileSize / 3;

    this.img = new Image();
    this.img.src = `./src/images/${name}.png`;
    this.spriteSize = 32;
    this.frameX = 0;
    this.frameY = 0;
    this.minFrame = 0;
    this.maxFrame = this.horizontalFrame * this.verticalFrame;
    this.frameRate = 10;
    this.lastFrame = 0;

    this.localPauseDelta = 0;

    this.damageAudio = ASSETS["damage"].cloneNode();
  }

  getMonsterStats() {
    const stats = MONSTERS_STATS.find((monster) => {
      return monster.name === this.name;
    });
    const statsToReturn = { ...stats };
    return statsToReturn;
  }

  findingPath(forceUpdate = true) {
    if (
      !forceUpdate &&
      this.lastTargetVec.x === this.targetVec.x &&
      this.lastTargetVec.y === this.targetVec.y
    ) {
      return;
    }
    this.startVec = tileMap.getPosition(this.x, this.y);

    if (
      this.startVec.x === this.targetVec.x &&
      this.startVec.y === this.targetVec.y
    ) {
      return;
    }
    this.path = findPath(this.startVec, this.targetVec, this.stats.type);
    this.moveToTarget = this.path ? this.path.shift() : null;
  }

  draw(ctx, timestamp) {
    const horizontalFrame = this.img.naturalWidth / 32;
    this.frameY = this.isTakingDamage ? 1 : 0;

    ctx.save();

    ctx.drawImage(
      this.img,
      this.frameX * this.spriteSize,
      this.frameY * this.spriteSize,
      this.spriteSize,
      this.spriteSize,
      this.x - this.radius / 2,
      this.y - this.radius / 2,
      this.radius,
      this.radius
    );

    if (!isPause) {
      if (calculateInterval(timestamp, this.lastFrame, 1000 / this.frameRate)) {
        this.frameX = this.frameX < horizontalFrame - 1 ? this.frameX + 1 : 0;
        this.lastFrame = timestamp;
      }
    }
    ctx.restore();
  }

  moveAlong() {
    if (!this.path || this.path.length <= 0) {
      return;
    }

    this.moveTo(this.path.shift());
  }

  moveTo(target) {
    this.moveToTarget = target;
  }

  bombMonsterMecs() {
    if (!this.isBombTarget) {
      this.ArrayToDelete =
        tileMap.deletableElements[
          Math.floor(Math.random() * tileMap.deletableElements.length)
        ];
      this.toDelete =
        this.ArrayToDelete[
          Math.floor(Math.random() * this.ArrayToDelete.length)
        ];
      if (this.toDelete) {
        this.targetVec = tileMap.getPosition(this.toDelete.x, this.toDelete.y);
        this.isBombTarget = true;
        this.findingPath();
      } else {
        return;
      }
    }
    const minDistance = 2 * pixelUnit;
    let distance = Math.hypot(
      this.toDelete.x - this.x + tileSize / 2,
      this.toDelete.y - this.y + tileSize / 2
    );
    if (distance <= minDistance) {
      this.stats.hp = 0;
      deleteFromElementArray(this.ArrayToDelete, this.targetVec);
      tileMap.map[this.targetVec.y][this.targetVec.x] = "bomb";
    }
  }

  update(ctx) {
    let timestamp = Date.now();

    if (pauseDelta > 0) {
      this.localPauseDelta = pauseDelta;
    }

    this.name !== "bombMonster" ? this.starMecanics() : null;
    this.name === "bombMonster" ? this.bombMonsterMecs() : null;
    if (this.isTakingDamage) {
      this.damageFrameCount++;
    }
    if (this.damageFrameCount === 10) {
      this.isTakingDamage = false;
      this.damageFrameCount = 0;
    }

    this.position = tileMap.getPosition(this.x, this.y);
    let currentTile = tileMap.map[this.position.y][this.position.x];

    if (
      calculateInterval(
        timestamp,
        this.lastLavaDamage,
        this.lavaCooldown + BONUS.LAVA_COOLDOWN,
        this.localPauseDelta
      ) &&
      currentTile === "lava"
    ) {
      !this.isTakingDamage ? this.takingDamage(3 + BONUS.LAVA_FORCE) : null;
      this.lastLavaDamage = timestamp;
      this.localPauseDelta = 0;
    }

    currentTile === "river" && this.type === "ground"
      ? (this.stats.hp = 0)
      : null;

    this.draw(ctx, timestamp);

    let dx = 0;
    let dy = 0;
    if (this.moveToTarget) {
      dx = this.moveToTarget.x - this.x;
      dy = this.moveToTarget.y - this.y;
      if (Math.abs(dx) < 2 * pixelUnit) {
        dx = 0;
      }
      if (Math.abs(dy) < 2 * pixelUnit) {
        dy = 0;
      }

      const angle = Math.atan2(dy, dx);
      this.velocity = {
        x: dx === 0 ? 0 : Math.cos(angle),
        y: dy === 0 ? 0 : Math.sin(angle),
      };
      let slowDownFactor = currentTile === "desert" ? this.desertFactor + BONUS.DESERT_SPEED : 1;

      this.x +=
        this.velocity.x *
        pixelUnit *
        delta *
        this.speed *
        slowDownFactor *
        speedFactor;
      this.y +=
        this.velocity.y *
        pixelUnit *
        delta *
        this.speed *
        slowDownFactor *
        speedFactor;

      if (dx === 0 && dy === 0) {
        if (this.path && this.path.length > 0) {
          this.moveTo(this.path.shift());
          return;
        }
        this.moveToTarget = undefined;
      }
    }

    this.lastTargetVec = this.targetVec;
  }

  takingDamage(damage) {
    this.stats.hp -= damage;
    this.isTakingDamage = true;
    const damageText = new DrawDamage(this, damage);
    damageTexts.push(damageText);
    !soundMute ? this.damageAudio.play() : null;
  }

  starMecanics() {
    const minDistance = 5 * pixelUnit;
    for (let i = 0; i < tileMap.stars.length; i++) {
      let star = tileMap.stars[i];
      let distance = Math.hypot(
        star.x - this.x + tileSize / 2,
        star.y - this.y + tileSize / 2
      );
      if (
        distance - star.stats.range - BONUS.STAR_RANGE <= 0 &&
        distance > minDistance &&
        !this.visitedStars.some(
          (visitedStar) => visitedStar.x === star.x && visitedStar.y === star.y
        )
      ) {
        this.targetVec = star.position;
        this.findingPath(false);
        this.visitedStars.push(star);
      }
      if (distance <= minDistance) {
        this.targetVec = this.defaultTargetVec;
        this.findingPath(false);
      }
    }
    if (
      !tileMap.stars.some(
        (star) =>
          star.position.x === this.targetVec.x &&
          star.position.y === this.targetVec.y
      )
    ) {
      this.targetVec = this.defaultTargetVec;
      this.findingPath(false);
    }
  }
}

import {
  tileSize,
  pixelUnit,
  pauseDelta,
  monsters,
  gameScreen,
  sideScreen,
  damageTexts,
  isPause,
  soundMute,
  tileMap,
} from "../app.js";
import { Projectile } from "./projectile.js";
import { calculateInterval, playSound } from "../core/utils.js";
import { DrawDamage } from "./utils.js";
import { marginLeft, marginTop } from "../UI/ScreenInit.js";
import { BONUS } from "../core/constants/bonus.js";
import { ASSETS } from "../core/loadAssets.js";
class Player {
  constructor(x, y, position, radius, image) {
    this.x = x;
    this.y = y;
    this.position = position;
    this.radius = radius;
    this.projectiles = [];
    this.projectileVelocity = {};

    this.maxHp = 30;
    this.stats = {
      hp: this.maxHp,
      exp: 0,
      force: 3,
      range: tileSize * 3.5,
      soulResource: 30,
    };
    this.level = 0;
    this.lastAttack = 0;
    this.isAttacking = false;

    this.isTakingDamage = false;
    this.damageFrameCount = 0;

    this.img = new Image();
    this.img.src = image;
    this.spriteSize = 32;
    this.frameX = 0;
    this.frameY = 0;
    this.minFrame = 0;
    this.maxFrame = this.horizontalFrame * this.verticalFrame;
    this.frameRate = 40;
    this.lastFrame = 0;

    this.bullet = ASSETS["bullet"].cloneNode();

    this.localPauseDelta = 0;

    this.shootAudio = ASSETS["shoot"].cloneNode();
  }

  draw(ctx) {
    let timestamp = Date.now();

    this.updateHp();

    if (this.stats.soulResource < 0) {
      this.stats.soulResource = 0;
    }

    this.frameY = this.isTakingDamage ? 1 : 0;

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
      if (this.isTakingDamage) {
        this.damageFrameCount++;
      }
      if (this.damageFrameCount === 10) {
        this.isTakingDamage = false;
        this.damageFrameCount = 0;
      }
      this.isAttacking ? this.shootAnimation(timestamp) : null;
      ctx.beginPath();
      ctx.lineWidth = 1 * pixelUnit;
      ctx.arc(
        this.x,
        this.y,
        this.stats.range + BONUS.GOD_RANGE,
        0,
        Math.PI * 2,
        false
      );
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.stroke();

      this.autoFire(timestamp, monsters);
      if (this.stats.exp >= this.stats.nextLvl) {
        this.stats.exp = 0;
        this.stats.nextLvl = Math.round(this.stats.nextLvl * 150) / 100;
      }
    }
    this.drawPlayerLife(ctx);
    this.drawLevel();
    this.drawsoulResource();
    this.drawHpLvl();
  }

  autoFire(timestamp, monsters) {
    if (pauseDelta > 0) {
      this.localPauseDelta = pauseDelta;
    }
    monsters.forEach((monster, index) => {
      monster.distance = Math.hypot(this.x - monster.x, this.y - monster.y);
      if (
        monster.distance <
          this.stats.range + BONUS.GOD_RANGE - monster.hitBox &&
        calculateInterval(
          timestamp,
          this.lastAttack,
          1000 - BONUS.GOD_COOLDOWN,
          this.localPauseDelta
        )
      ) {
        const angle = Math.atan2(monster.y - this.y, monster.x - this.x);
        this.projectileVelocity = {
          x: Math.cos(angle) * 5,
          y: Math.sin(angle) * 5,
          angle: angle,
        };
        this.isAttacking = true;
        this.lastAttack = timestamp;

        this.localPauseDelta = 0;
      }
    });
  }

  shoot() {
    !soundMute ? this.shootAudio.play() : null;
    this.projectiles.push(
      new Projectile(
        this.x,
        this.y,
        "white",
        this.projectileVelocity,
        this.stats.force + BONUS.GOD_FORCE,
        this.bullet
      )
    );
  }

  takingDamage(damage) {
    this.stats.hp -= damage;
    this.isTakingDamage = true;
    const damageText = new DrawDamage(this, damage);
    damageTexts.push(damageText);
    playSound("godDamage");
  }

  shootAnimation(timestamp) {
    const horizontalFrame = this.img.naturalWidth / 32;

    if (calculateInterval(timestamp, this.lastFrame, 1000 / this.frameRate)) {
      if (this.frameX < horizontalFrame - 1) {
        this.frameX += 1;
      } else {
        this.frameX = 0;
        this.shoot();
        this.isAttacking = false;
      }
      this.lastFrame = timestamp;
    }
  }

  drawPlayerLife(ctx) {
    const barRatio = this.stats.hp / this.maxHp;

    const barWidth = tileSize * 9.5;
    const barHeight = tileSize / 3;
    let barX = gameScreen.width + (sideScreen.width - barWidth) / 2;
    let barY = tileSize / 2;

    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
    ctx.fillRect(barX, barY, barWidth, barHeight);
    ctx.fillStyle = "rgba(0, 175, 0, 0.9)";
    ctx.fillRect(barX, barY, barWidth * barRatio, barHeight);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1 * pixelUnit;
    ctx.strokeRect(
      barX,
      barY - 1 * pixelUnit,
      barWidth,
      barHeight + 2 * pixelUnit
    );
    ctx.restore();
  }

  drawsoulResource() {
    const soulResource = document.getElementById("soulResource");
    soulResource.innerHTML = `${this.stats.soulResource}`;
    soulResource.style.left = `${
      marginLeft + gameScreen.width + tileSize / 2
    }px`;
    soulResource.style.top = `${marginTop + tileSize * 1.3}px`;
    soulResource.style.fontSize = `${tileSize / 2}px`;
  }

  drawLevel() {
    const levelText = document.getElementById("levelText");
    levelText.innerHTML = `LVL: ${this.level}`;
    levelText.style.left = `${marginLeft + gameScreen.width + tileSize / 2}px`;
    levelText.style.top = `${marginTop + tileSize * 2}px`;
    levelText.style.fontSize = `${tileSize / 2}px`;
  }

  drawHpLvl() {
    const hpLvl = document.getElementById("hpLvl");
    hpLvl.innerHTML = `${this.stats.hp}/${this.maxHp}`;
    hpLvl.style.width = `${tileSize * 9.5}px`;
    hpLvl.style.height = `${tileSize / 3}px`;
    hpLvl.style.left = `${
      gameScreen.width + (sideScreen.width - tileSize * 9.5) / 2
    }px`;
    hpLvl.style.top = `${marginTop + tileSize / 2 + 1 * pixelUnit}px`;
    hpLvl.style.fontSize = `${9 * pixelUnit}px`;
  }

  updateHp(isClicked = false) {
    if (isClicked) {
      setTimeout(() => {
        this.maxHp = 30 + tileMap.mountains.length * 5;
      }, 100);
    }

    if (this.stats.hp > this.maxHp) {
      this.stats.hp = this.maxHp;
    }

    if (this.stats.hp < 0) {
      this.stats.hp = 0;
    }
  }
}

export { Player };

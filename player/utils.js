import { tileSize, pixelUnit, delta, damageTexts } from "../app.js";

function drawLifeBar(ctx, entity) {
  let x = entity.x - tileSize / 2;
  let y = entity.y - tileSize / 2;
  if (entity.stats.hp < entity.maxHp) {
    let barRatio = entity.stats.hp / entity.maxHp;
    barRatio < 0 ? barRatio = 0 : barRatio
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
    ctx.fillRect(
      x + (tileSize * 0.4) / 2,
      y - tileSize * 0.1,
      tileSize * 0.6,
      tileSize * 0.1
    );
    ctx.fillStyle = "rgba(0, 175, 0, 0.9)";
    ctx.fillRect(
      x + (tileSize * 0.4) / 2,
      y - tileSize * 0.1,
      tileSize * barRatio * 0.6,
      tileSize * 0.1
    );
    ctx.restore();
  }
}

class DrawDamage {
  constructor(entity, damage) {
    this.entity = entity;
    this.y = entity.y - tileSize/2;
    this.yGap = 0
    this.damage = damage;
    this.hue = 1;
  }

  draw(ctx) {
    ctx.save()
    let x = this.entity.x;
    x -= this.entity.radius / 2;
    ctx.font = `${tileSize / 3}px dogicapixel`;
    ctx.fillStyle = `hsla(1, 100%, 100%, ${this.hue})`;
    ctx.textAlign = "center";
    ctx.fillText(this.damage, x + tileSize / 2, this.y);

    this.yGap -= 0.5 * pixelUnit * delta;
    this.y = this.entity.y - tileSize/2 + this.yGap
    this.hue -= 0.05;
    ctx.restore()
  }
}

function hitMonsters(monster, damage) {
  monster.stats.hp -= damage;
  const damageText = new DrawDamage(monster, damage);
  damageTexts.push(damageText);
}

export { drawLifeBar, hitMonsters, DrawDamage };

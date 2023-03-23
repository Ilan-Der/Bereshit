import { tileSize, pixelUnit, monsters } from "../app.js";
import { BONUS } from "../core/constants/bonus.js";
import { hitMonsters } from "./utils.js";

class Thunder {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.minSegmentHeight = 5;
    this.groundHeight = this.y;
    this.color = "hsl(180, 80%, 100%)";
    this.roughness = 2;
    this.maxDifference = this.y / 5;
    this.lightningArray = [];
    this.maxRadius = tileSize * 2;
    this.radius = 0;
    this.damage = 100;
  }

  update(ctx) {
    ctx.strokeStyle = this.color;

    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 1 * pixelUnit;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.stroke();
    ctx.restore();

    this.radius += 6 * pixelUnit;

    monsters.forEach((monster, index) => {
      monster.distance = Math.hypot(this.x - monster.x, this.y - monster.y);
      if (monster.distance < this.radius + BONUS.THUNDER_RANGE - monster.hitBox) {
        hitMonsters(monster, this.damage + BONUS.THUNDER_FORCE);
      }
    });

    var lightning = this.createLightning();
    this.lightningArray.push(lightning);

    ctx.beginPath();
    for (var i = 0; i < lightning.length; i++) {
      ctx.lineTo(lightning[i].x, lightning[i].y);
    }
    ctx.stroke();
  }

  createLightning() {
    var segmentHeight = tileSize;
    var lightning = [];
    lightning.push({ x: this.x + (Math.random() - 0.5) * tileSize * 2, y: 0 });
    lightning.push({
      x: this.x,
      y: this.y,
    });
    var currDiff = this.maxDifference;
    while (segmentHeight > this.minSegmentHeight) {
      var newSegments = [];
      for (var i = 0; i < lightning.length - 1; i++) {
        var start = lightning[i];
        var end = lightning[i + 1];
        var midX = (start.x + end.x) / 2;
        var newX = midX + (Math.random() * 2 - 1) * currDiff;
        newSegments.push(start, { x: newX, y: (start.y + end.y) / 2 });
      }

      newSegments.push(lightning.pop());
      lightning = newSegments;

      currDiff /= this.roughness;
      segmentHeight /= 2;
    }
    return lightning;
  }
}

export { Thunder };

import { tileSize, pixelUnit, particles } from "../../app.js";
import { BONUS } from "../../core/constants/bonus.js";
import { Particle } from "../../player/visualEffects.js";

export class Star {
  constructor(x, y, image) {
    this.x = x * tileSize;
    this.y = y * tileSize;
    this.position = { x, y };
    this.position = { x: x, y: y };
    this.type = "star";
    this.stats = {
      range: tileSize * 2.5,
    };
    this.starImage = image;
    this.particlesArray = [];
  }

  update(ctx) {
    ctx.beginPath();
    ctx.lineWidth = 1 * pixelUnit;
    ctx.arc(
      this.x + tileSize / 2,
      this.y + tileSize / 2,
      this.stats.range + BONUS.STAR_RANGE,
      0,
      Math.PI * 2,
      false
    );
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.stroke();
    this.createParticles(ctx);
    for (let i = 0; i < this.particlesArray.length; i++) {
      const particle = this.particlesArray[i];
      particle.update(ctx);
      const distance = Math.hypot(
        this.x + tileSize / 2 - particle.x,
        this.y + tileSize / 2 - particle.y
      );
      if (distance <= 5 * pixelUnit) {
        this.particlesArray.splice(i, 1);
      }
    }
  }

  createParticles(ctx) {
    let numberOfParticles = 10;
    const starCenter = { x: this.x + tileSize / 2, y: this.y + tileSize / 2 };
    while (this.particlesArray.length < numberOfParticles) {
      let size = Math.random() * 3 * pixelUnit;
      let angle = Math.random() * Math.PI * 2;
      let x =
        Math.cos(angle) *
          Math.random() *
          (this.stats.range + BONUS.STAR_RANGE) +
        starCenter.x;
      let y =
        Math.sin(angle) *
          Math.random() *
          (this.stats.range + BONUS.STAR_RANGE) +
        starCenter.y;
      let speed = 300;
      let directionX = -(x - starCenter.x) / speed;
      let directionY = -(y - starCenter.y) / speed;

      const velocity = { x: directionX, y: directionY };
      this.particlesArray.push(
        new Particle(x, y, size, velocity, "white", true)
      );
    }
  }
}

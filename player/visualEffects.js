import { pixelUnit, delta, tileSize } from "../app.js";

class Particle {
  constructor(x, y, radius, velocity, color, isStar) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.speed = 3;
    this.isStar = isStar ?? false
    this.decreaseSpeed = isStar ? 0.03 : 0.05
  }

  draw(ctx) {
    this.color = "white";
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.radius, this.radius);
    ctx.restore();
  }

  update(ctx) {
    this.draw(ctx);
    this.x += this.velocity.x * pixelUnit * this.speed * delta;
    this.y += this.velocity.y * pixelUnit * this.speed * delta;

    this.radius -= this.decreaseSpeed * pixelUnit * delta;}
}

export { Particle };

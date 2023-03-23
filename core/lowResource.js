import { canvasScreen, gameScreen, pixelUnit, tileSize } from "../app.js";
import { marginLeft, marginTop } from "../UI/ScreenInit.js";

export class LowResource {
  constructor(type) {
    this.width = gameScreen.width;
    this.x = marginLeft + canvasScreen.width / 2 - this.width / 2;
    this.y = marginTop + tileSize * 5;
    this.opacity = 1;
    this.type = type;
    this.text = this.handleText();
  }

  handleText() {
    if (this.type === "resource") {
      return "Not enough resources";
    }
    if (this.type === "maxTile") {
      return "Maximum tile for this type reahced";
    }
  }

  update(delta) {
    const previousText = document.getElementById("lowResource");
    previousText ? previousText.remove() : null;

    const text = document.createElement("p");
    text.id = "lowResource";
    text.classList.add("lowResource");
    const gameScreen = document.getElementById("gameScreen");
    gameScreen.appendChild(text);
    text.innerHTML = this.text;
    text.style.position = "absolute";
    text.style.width = `${this.width}px`;
    text.style.height = `${tileSize}px`;
    text.style.fontSize = `${(tileSize * 3) / 4}px`;
    text.style.color = `rgba(230,85,85,${this.opacity})`;
    text.style.backgroundColor = `rgba(0,0,0,${this.opacity})`;
    text.style.top = `${this.y}px`;

    this.opacity -= 0.01 * delta;
    this.y -= 0.5 * pixelUnit * delta;
  }
}

import { canvasScreen, startGame, tileSize, pixelUnit } from "../app.js";
import { ASSETS } from "../core/loadAssets.js";
import { playSound } from "../core/utils.js";
import { resetButton } from "./pauseMenu.js";
import { marginLeft, marginTop } from "./ScreenInit.js";

export function gameOverScreen(level) {
  const gameOverScreen = document.getElementById("gameOverScreen");
  gameOverScreen.classList.remove("disable");

  const mainMenuCanvas = document.getElementById("mainMenuCanvas");
  const mainMenu = document.getElementById("mainMenu");

  const gameOverScreenText = document.createElement("p");
  gameOverScreen.appendChild(gameOverScreenText);
  gameOverScreenText.id = "gameOverScreenText";
  gameOverScreenText.innerText = `Level Reached : ${level}`;
  gameOverScreenText.style.fontSize = `${tileSize * 1.5}px`;
  gameOverScreenText.style.display = "flex";

  resetButton(true)
}

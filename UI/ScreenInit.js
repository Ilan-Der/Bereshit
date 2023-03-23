import { tileMap, pixelUnit, mainMenuCanvas } from "../app.js";
import { mapSizeX, mapSizeY } from "../level/map.js";
import { ASSETS, ASSETS_COUNT, loadAssets } from "../core/loadAssets.js";
import { musicMuteElement, soundMuteElement } from "./pauseMenu.js";

const screenRatio = 2 / 3;
let marginTop = 0;
let marginLeft = 0;

function screenInit(canvasScreen) {
  const screenWidth = innerWidth;
  const screenHeight = innerHeight;
  canvasScreen.width = innerWidth;
  tileMap.tileSize = (canvasScreen.width * screenRatio) / mapSizeX;
  let tileSize = tileMap.tileSize;
  canvasScreen.height = mapSizeY * tileSize;

  if (canvasScreen.height > screenHeight) {
    canvasScreen.height = screenHeight;
    tileMap.tileSize = canvasScreen.height / mapSizeY;
    tileSize = tileMap.tileSize;
    canvasScreen.width = mapSizeX * tileSize + (mapSizeX * tileSize) / 2;
    marginLeft = (screenWidth - canvasScreen.width) / 2;
  }
  marginTop = screenHeight / 2 - canvasScreen.height / 2;

  canvasScreen.style.marginTop = `${marginTop}px`;
  canvasScreen.style.marginLeft = `${marginLeft}px`;

  const gameScreen = {
    width: mapSizeX * tileSize,
    height: mapSizeY * tileSize,
  };

  const sideScreen = {
    width: canvasScreen.width - gameScreen.width,
    height: canvasScreen.height,
  };

  const levelUpScreen = document.getElementById("levelUpScreen");
  levelUpScreen.style.height = `${gameScreen.height}px`;
  levelUpScreen.style.width = `${gameScreen.width + sideScreen.width}px`;
  levelUpScreen.style.top = `${marginTop}px`;
  levelUpScreen.style.left = `${marginLeft}px`;

  const pixelUnit = tileSize / 32;

  const buttonContainer = document.getElementById("buttonContainer");
  buttonContainer.style.left = `${gameScreen.width + marginLeft}px`;
  buttonContainer.style.width = `${sideScreen.width}px`;
  buttonContainer.style.top = `${tileSize * 3 + marginTop}px`;

  const mainMenu = document.getElementById("mainMenu");
  const mainMenuP = mainMenu.querySelector("p");
  mainMenuP.style.fontSize = `${14 * pixelUnit}px`;
  mainMenuP.style.lineHeight = `${24 * pixelUnit}px`;

  const mainMenuImg = mainMenu.querySelector("img");
  mainMenuImg.style.height = `${tileSize * 5}px`;
  mainMenuImg.style.top = `${marginTop + tileSize * 1}px`;
  mainMenuImg.style.left = `${
    marginLeft + canvasScreen.width / 2 - tileSize * 2.5
  }px`;

  const startBtn = document.getElementById("startBtn");
  const startBtnImg = ASSETS["menuButtonStart"];
  startBtn.appendChild(startBtnImg);

  startBtn.style.height = `${tileSize * 2}px`;
  startBtn.style.width = `${tileSize * 6}px`;
  startBtn.style.fontSize = `${tileSize * 0.65}px`;

  startBtn.style.top = `${marginTop + tileSize * 7}px`;
  startBtn.style.left = `${
    marginLeft + canvasScreen.width / 2 - tileSize * 3
  }px`;

  const startBtnAsGod = document.getElementById("startBtnAsGod");
  const startBtnAsGodImg = ASSETS["menuButtonStartAsGod"];
  startBtnAsGod.appendChild(startBtnAsGodImg);
  startBtnAsGod.style.height = `${tileSize}px`;
  startBtnAsGod.style.width = `${tileSize * 6}px`;
  startBtnAsGod.style.fontSize = `${tileSize * 0.55}px`;

  startBtnAsGod.style.top = `${marginTop + tileSize * 9.5}px`;
  startBtnAsGod.style.left = `${
    marginLeft + canvasScreen.width / 2 - tileSize * 3
  }px`;
  startBtnAsGod.style.padding = `${9.5 * pixelUnit}px`;

  musicMuteElement(tileSize, true);
  soundMuteElement(tileSize, true);

  mainMenuCanvas.width = gameScreen.width + sideScreen.width;
  mainMenuCanvas.height = gameScreen.height;
  mainMenuCanvas.style.top = `${marginTop}px`;
  mainMenuCanvas.style.left = `${marginLeft}px`;

  const beforeInit = document.getElementById("beforeInit");
  beforeInit.classList.add("disable");
}

function drawSideScreenBackground(ctx, screen, sideScreen) {
  ctx.save();
  ctx.fillStyle = "rgba(50,50,50, 1)";
  ctx.fillRect(screen.width, 0, sideScreen.width, sideScreen.height);
  ctx.restore();
}

const stars = [];
const mainMenuStars = [];

function drawBackGameBackground(ctx, screen, isMainMenu = false) {
  const maxStars = 200;
  let starsArray;
  starsArray = isMainMenu ? mainMenuStars : stars;
  ctx.save();
  ctx.fillStyle = "rgba(10, 10, 10, 1)";
  ctx.fillRect(0, 0, screen.width, screen.height);
  ctx.restore();
  if (stars.length < maxStars) {
    for (let i = 0; i < maxStars; i++) {
      generateStars(starsArray, screen);
    }
  }
  drawStars(ctx, starsArray);
}

function generateStars(starsArray, screen) {
  const xStar = Math.random() * screen.width;
  const yStar = Math.random() * screen.height;
  const starSize = Math.random() * 4 * pixelUnit;
  const brightness = Math.random() * (0.5 - 0.1) + 0.1;
  starsArray.push({
    xStar: xStar,
    yStar: yStar,
    starSize: starSize,
    brightness: brightness,
  });
}

function drawStars(ctx, starsArray) {
  for (let star = 0; star < starsArray.length; star++) {
    ctx.save();
    ctx.fillStyle = `rgba(250, 250, 250, ${starsArray[star].brightness})`;
    ctx.fillRect(
      starsArray[star].xStar,
      starsArray[star].yStar,
      starsArray[star].starSize,
      starsArray[star].starSize
    );
    ctx.restore();
  }
}

export {
  screenInit,
  drawSideScreenBackground,
  drawBackGameBackground,
  marginTop,
  marginLeft,
};

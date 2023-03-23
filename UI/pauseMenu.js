import {
  isPause,
  tileSize,
  pixelUnit,
  musicMuteFunction,
  soundMuteFunction,
  soundMute,
  musicMute,
  updatePause,
  selectedBtn,
  ctxmainMenuCanvas,
  mainMenu,
  mainMenuCanvas,
  initIsGod,
  updateSelectedBtn,
} from "../app.js";
import { resetBonus } from "../core/constants/bonus.js";
import { ASSETS } from "../core/loadAssets.js";
import { playSound } from "../core/utils.js";
import { updateStatusText } from "./actionButtons.js";
import { resetCardContainer } from "./card-creation.js";
import { marginTop, marginLeft, drawBackGameBackground } from "./ScreenInit.js";

export function handlePauseMenu() {
  const pauseMenu = document.getElementById("pauseMenu");
  if (isPause) {
    pauseMenu.classList.remove("disable");
    const soundsOption = document.getElementById("soundsOption");
    soundsOption.classList.remove("disable");
    resetButton();
    resumeButton();
    musicMuteElement(tileSize, false);
    soundMuteElement(tileSize, false);
  }
}

export function resetButton(isGameOver = false) {
  const yPos = isGameOver ? 9 : 7.5;
  const pauseMenu = document.getElementById("pauseMenu");
  const resetButton = document.getElementById("resetButton");
  const gameOverScreen = document.getElementById("gameOverScreen");

  resetButton.classList.remove("disable");
  const resetButtonImg = new Image();
  resetButtonImg.src = "./src/images/menuButtonStartAsGod.png";
  resetButton.appendChild(resetButtonImg);
  resetButton.classList.add("resetButton");
  resetButton.style.height = `${tileSize}px`;
  resetButton.style.width = `${tileSize * 6}px`;
  resetButton.style.top = `${marginTop + tileSize * yPos}px`;
  resetButton.style.left = `${
    marginLeft + canvasScreen.width / 2 - tileSize * 3
  }px`;
  resetButton.style.fontSize = `${tileSize * 0.55}px`;
  resetButton.style.padding = `${9.5 * pixelUnit}px`;
  resetButton.onclick = () => {
    const buttonContainer = document.getElementById("buttonContainer");
    buttonContainer.innerHTML = "";
    updateSelectedBtn(undefined);
    resetCardContainer();
    resetBonus();
    musicMuteElement(tileSize, true);
    soundMuteElement(tileSize, true);
    buttonContainer.style.height = "0px";
    const cardDescription = document.getElementById("cardDescription");
    cardDescription.style.height = "0px";
    const actionButtons = document.getElementById("actionButtons");
    actionButtons.classList.add("disable");
    const soulResource = document.getElementById("soulResource");
    soulResource.classList.add("disable");
    const levelText = document.getElementById("levelText");
    levelText.classList.add("disable");
    const hpLvl = document.getElementById("hpLvl");
    hpLvl.classList.add("disable");
    initIsGod();
    drawBackGameBackground(ctxmainMenuCanvas, mainMenuCanvas, true);
    setTimeout(() => {
      gameOverScreen ? gameOverScreen.classList.add("disable") : null;
      resetButton.classList.add("disable");
      pauseMenu.classList.add("disable");
      mainMenu.classList.remove("disable");
      mainMenuCanvas.classList.remove("disable");
    }, 100);
    playSound("clic");
  };
}

function resumeButton() {
  const resumeButton = document.getElementById("resumeButton");
  const resetButton = document.getElementById("resetButton");
  const resumeButtonImg = new Image();
  resumeButtonImg.src = "./src/images/menuButtonStartAsGod.png";
  resumeButton.appendChild(resumeButtonImg);
  resumeButton.classList.add("resumeButton");
  resumeButton.style.height = `${tileSize}px`;
  resumeButton.style.width = `${tileSize * 6}px`;
  resumeButton.style.top = `${marginTop + tileSize * 6}px`;
  resumeButton.style.left = `${
    marginLeft + canvasScreen.width / 2 - tileSize * 3
  }px`;
  resumeButton.style.fontSize = `${tileSize * 0.55}px`;
  resumeButton.style.padding = `${9.5 * pixelUnit}px`;
  resumeButton.onclick = () => {
    resetButton.classList.add("disable");
    pauseMenu.classList.add("disable");
    if (!selectedBtn || selectedBtn.type === "godTile") {
      updatePause(false);
    }
    updateStatusText(pixelUnit);
    const soundsOption = document.getElementById("soundsOption");
    soundsOption.classList.add("disable");
    playSound("clic");
  };
}

export function musicMuteElement(tileSize, isMain) {
  const yPos = isMain ? tileSize * 11.5 : tileSize * 9.5;

  const musicMuteElement = document.getElementById("musicMute");
  musicMuteElement.style.top = `${marginTop + yPos}px`;
  musicMuteElement.style.fontSize = `${tileSize * 0.55}px`;
  musicMuteElement.style.width = `${tileSize * 5}px`;
  musicMuteElement.style.left = `${
    marginLeft + canvasScreen.width / 2 - tileSize * 3
  }px`;

  const musicMuteButton = document.getElementById("musicMuteButton");
  musicMuteButton.style.height = `${tileSize}px`;
  musicMuteButton.style.width = `${tileSize}px`;

  let musicMuteButtonImg = !musicMute ? ASSETS["music"] : ASSETS["musicMute"];
  musicMuteButton.appendChild(musicMuteButtonImg);
  musicMuteButtonImg.style.height = `${tileSize}px`;
  musicMuteButtonImg.style.width = `${tileSize}px`;
  musicMuteButton.style.position = "absolute";
  musicMuteButton.style.right = `0px`;

  musicMuteButton.onclick = () => {
    musicMuteFunction();
    musicMuteButtonImg.remove();
    musicMuteButtonImg = !musicMute ? ASSETS["music"] : ASSETS["musicMute"];
    musicMuteButton.appendChild(musicMuteButtonImg);
    musicMuteButtonImg.style.height = `${tileSize}px`;
    musicMuteButtonImg.style.width = `${tileSize}px`;
    playSound("clic");
  };
}

export function soundMuteElement(tileSize, isMain) {
  const yPos = isMain ? tileSize * 13 : tileSize * 11;
  const soundMuteElement = document.getElementById("soundMute");
  soundMuteElement.style.top = `${marginTop + yPos}px`;
  soundMuteElement.style.fontSize = `${tileSize * 0.55}px`;
  soundMuteElement.style.width = `${tileSize * 5}px`;
  soundMuteElement.style.left = `${
    marginLeft + canvasScreen.width / 2 - tileSize * 3
  }px`;

  const soundMuteButton = document.getElementById("soundMuteButton");
  soundMuteButton.style.height = `${tileSize}px`;
  soundMuteButton.style.width = `${tileSize}px`;
  soundMuteButton.style.position = "absolute";
  soundMuteButton.style.right = `0px`;
  let soundMuteButtonImg = !soundMute ? ASSETS["sound"] : ASSETS["soundMute"];
  soundMuteButton.appendChild(soundMuteButtonImg);
  soundMuteButtonImg.style.height = `${tileSize}px`;
  soundMuteButtonImg.style.width = `${tileSize}px`;
  soundMuteButton.onclick = () => {
    soundMuteFunction();
    soundMuteButtonImg.remove();
    soundMuteButtonImg = !soundMute ? ASSETS["sound"] : ASSETS["soundMute"];
    soundMuteButton.appendChild(soundMuteButtonImg);
    soundMuteButtonImg.style.height = `${tileSize}px`;
    soundMuteButtonImg.style.width = `${tileSize}px`;
    playSound("clic");
  };
}

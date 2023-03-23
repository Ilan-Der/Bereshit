import { TileMap } from "./level/tileMap.js";
import { Particle } from "./player/visualEffects.js";
import { spawnMonsters } from "./player/NPCs/spawn.js";
import { drawCards } from "./UI/card-creation.js";
import { resetTileCards } from "./core/constants/tiles.js";
import {
  drawSideScreenBackground,
  drawBackGameBackground,
  screenInit,
} from "./UI/ScreenInit.js";
import { Monster } from "./player/NPCs/monster.js";
import { drawLifeBar } from "./player/utils.js";
import { mapSizeX, mapSizeY } from "./level/map.js";
import { levelUpScreen } from "./UI/levelUp.js";
import { createActionButton, updateStatusText } from "./UI/actionButtons.js";
import { handleClick, thunders } from "./core/handleClick.js";
import { gameOverScreen } from "./UI/gameOverScreen.js";
import { BONUS, resetBonus } from "./core/constants/bonus.js";
import { ASSETS, loadAssets } from "./core/loadAssets.js";
import { renderCardDescription } from "./UI/card-description.js";
import { playSound } from "./core/utils.js";

///
/// esbuild  --bundle --outfile=bundle.js app.js
///

export let isPause = true;
export function inversePause() {
  isPause = !isPause;
  updateStatusText(pixelUnit);
}

export function updatePause(bool) {
  isPause = bool;
  updateStatusText(pixelUnit);
}

export let monsters;
export let damageTexts;
export let lowResources = [];
export let particles = [];

export function emptyLowResourcesArray() {
  lowResources = [];
  const previousText = document.getElementById("lowResource");
  previousText ? previousText.remove() : null;
}

export const canvasScreen = document.getElementById("canvasScreen");
export const ctxScreen = canvasScreen.getContext("2d");
export const mainMenuCanvas = document.getElementById("mainMenuCanvas");
export const ctxmainMenuCanvas = canvasScreen.getContext("2d");

export let musicMute = false;
export let soundMute = false;

export function musicMuteFunction() {
  musicMute = !musicMute;
}
export function soundMuteFunction() {
  soundMute = !soundMute;
}

export let tileMap;

export let delta = 0;
export let pauseDelta = 0;
export let levelUp = true;
export let selectedBtn;

export function inverseLeveUp() {
  levelUp = !levelUp;
  updateStatusText(pixelUnit);
}

export function updateSelectedBtn(btn) {
  selectedBtn = btn;
}

export const mainMenu = document.getElementById("mainMenu");

export let isGod = false;

export function initIsGod() {
  isGod = false;
}

export let tileSize;
export let pixelUnit;
export let gameScreen;
export let sideScreen;

let musicPause = false;

async function initWorld() {
  await loadAssets(canvasScreen);

  window.addEventListener("blur", () => {
    ASSETS["mainLoop"].pause();
    musicPause = true;
    isPause = true;
    updateStatusText(pixelUnit);
  });

  window.addEventListener("focus", (event) => {
    musicPause = false;
  });

  canvasScreen.addEventListener("click", (event) => {
    handleClick(event);
  });

  document.getElementById("startBtn").addEventListener("click", () => {
    playSound("clic");
    startGame();
  });

  document.getElementById("startBtnAsGod").addEventListener("click", () => {
    isGod = true;
    playSound("clic");
    startGame();
  });

  tileMap = new TileMap();
  screenInit(canvasScreen);

  tileSize = tileMap.tileSize;
  document.documentElement.style.setProperty("--tileSize", tileSize + "px");
  pixelUnit = tileSize / 32;
  gameScreen = {
    width: mapSizeX * tileSize,
    height: mapSizeY * tileSize,
  };

  sideScreen = {
    width: canvasScreen.width - gameScreen.width,
    height: canvasScreen.height,
  };

  drawBackGameBackground(ctxmainMenuCanvas, mainMenuCanvas, true);
}
initWorld();

function init() {
  resetBonus();
  resetTileCards();
  tileMap.init();
  levelUp = true;
  monsters = [];
  damageTexts = [];
  particles = [];
}

export function startGame() {
  init();
  isPause = false;
  const soundsOption = document.getElementById("soundsOption");
  soundsOption.classList.add("disable");
  const soulResource = document.getElementById("soulResource");
  soulResource.classList.remove("disable");
  const levelText = document.getElementById("levelText");
  levelText.classList.remove("disable");
  const hpLvl = document.getElementById("hpLvl");
  hpLvl.classList.remove("disable");
  drawCards();
  renderCardDescription();
  createActionButton(pixelUnit);
  mainMenu.classList.add("disable");
  mainMenuCanvas.classList.add("disable");
  animate();
}

let lastFrameTimeMs = 0; // The last time the loop was run
let lastTextFrameTimeMs = 0;
let lastFrameBeforePause = 0;
let maxFPS = 90; // The maximum FPS we want to allow
let deltaFactor = 10;

function animate(timestamp) {
  if (musicPause) {
    ASSETS["mainLoop"].pause();
  } else {
    !musicMute ? ASSETS["mainLoop"].play() : ASSETS["mainLoop"].pause();
  }
  if (isPause) {
    pauseDelta = timestamp - lastFrameBeforePause;
    lastFrameTimeMs = timestamp;

    const Textdelta = (timestamp - lastTextFrameTimeMs) / deltaFactor;

    lowResources.forEach((lowResource, index) => {
      lowResource.update(Textdelta);
      if (lowResource.opacity <= 0) {
        lowResources.splice(index, 1);
        const previousText = document.getElementById("lowResource");
        previousText ? previousText.remove() : null;
      }
    });
    lastTextFrameTimeMs = timestamp;

    requestAnimationFrame(animate);
    return;
  }
  if (timestamp < lastFrameTimeMs + 1000 / maxFPS) {
    requestAnimationFrame(animate);
    return;
  }

  delta = (timestamp - lastFrameTimeMs) / deltaFactor; // get the delta time since last frame

  lastFrameTimeMs = timestamp;
  lastFrameBeforePause = timestamp;
  ctxScreen.clearRect(0, 0, canvasScreen.width, canvasScreen.height);

  drawBackGameBackground(ctxScreen, gameScreen);

  tileMap.draw(ctxScreen); // draw the map
  const mainPlayer = tileMap.players[0];
  isGod ? (mainPlayer.stats.soulResource = 99999999) : null;
  isGod ? (mainPlayer.maxHp = 9999) : null;
  isGod ? (mainPlayer.stats.hp = 9999) : null;
  spawnMonsters(); // method that handle any spawning monsters
  if (levelUp) {
    isPause = true;
    updateStatusText(pixelUnit);
    levelUpScreen(levelUp);
  }

  particles.forEach((particle, index) => {
    particle.update(ctxScreen);
    if (particle.radius < 0) {
      particles.splice(index, 1);
    }
  });

  for (let i = 0; i < tileMap.spawnPoints.length; i++) {
    const spawnPoint = tileMap.spawnPoints[i];
    spawnPoint.update(ctxScreen);
  }

  for (let i = 0; i < tileMap.rivers.length; i++) {
    const river = tileMap.rivers[i];
    river.update(ctxScreen);
  }

  for (let i = 0; i < tileMap.lavas.length; i++) {
    const lava = tileMap.lavas[i];
    lava.update(ctxScreen);
  }
  
  monsters.forEach((monster, index) => {
    drawLifeBar(ctxScreen, monster);

    monster.update(ctxScreen);

    if (!monster.path || monster.path.length === 0) {
      monsters.push(
        new Monster(
          monster.x - tileSize / 2,
          monster.y - tileSize / 2,
          tileSize,
          "bombMonster",
          "air"
        )
      );
      monsters.splice(index, 1);
    }

    // Touch player

    const distance = Math.hypot(
      mainPlayer.x - monster.x,
      mainPlayer.y - monster.y
    );
    if (distance - monster.hitBox < 1) {
      mainPlayer.takingDamage(monster.stats.force);
      monster.stats.hp = 0;
    }

    if (monster.stats.hp <= 0) {
      for (let i = 0; i < 20; i++) {
        particles.push(
          new Particle(
            monster.x,
            monster.y,
            Math.random() * 2 * pixelUnit,
            {
              x: Math.random() - 0.5,
              y: Math.random() - 0.5,
            },
            "white"
          )
        );
      }

      monsters = monsters.filter((item) => {
        return item !== monster;
      });
    }
  });

  damageTexts.forEach((damageText, damageTextIndex) => {
    damageText.draw(ctxScreen);
    if (damageText.hue <= 0) {
      damageTexts.splice(damageTextIndex, 1);
    }
  });

  for (let i = 0; i < tileMap.stars.length; i++) {
    const star = tileMap.stars[i];
    star.update(ctxScreen);
  }

  for (let i = 0; i < tileMap.temples.length; i++) {
    const temple = tileMap.temples[i];
    temple.update(ctxScreen);
  }

  for (let i = 0; i < tileMap.trees.length; i++) {
    const tree = tileMap.trees[i];
    tree.update(ctxScreen);
  }

  for (let i = 0; i < thunders.length; i++) {
    const thunder = thunders[i];
    thunder.update(ctxScreen);
    if (thunder.radius >= thunder.maxRadius + BONUS.THUNDER_RANGE) {
      thunders.splice(i, 1);
    }
  }

  for (let i = 0; i < tileMap.towers.length; i++) {
    const tower = tileMap.towers[i];
    tower.update(ctxScreen);

    tower.projectiles.forEach((projectile, projectileIndex) => {
      monsters.forEach((monster, index) => {
        const distance = Math.hypot(
          projectile.x - monster.x,
          projectile.y - monster.y
        );
        if (distance - monster.hitBox - projectile.radius < 1) {
          tower.projectiles.splice(projectileIndex, 1);
          !monster.isTakingDame ? monster.takingDamage(projectile.force) : null;
          return;
        }
      });
      projectile.update(ctxScreen);
      if (
        projectile.x + projectile.radius < 1 ||
        projectile.y + projectile.radius < 1 ||
        projectile.x - projectile.radius > gameScreen.width ||
        projectile.y - projectile.radius > gameScreen.height
      ) {
        setTimeout(() => {
          tower.projectiles.splice(projectileIndex, 1);
        });
      }
    });
  }

  drawSideScreenBackground(ctxScreen, gameScreen, sideScreen);

  tileMap.players.forEach((player, index) => {
    player.draw(ctxScreen);
    // Condition of death GAME OVER
    if (mainPlayer.stats.hp <= 0) {
      isPause = true;
      init();
      setTimeout(() => {
        gameOverScreen(mainPlayer.level);
      }, 300);
    }
    player.projectiles.forEach((projectile, projectileIndex) => {
      monsters.forEach((monster, index) => {
        const distance = Math.hypot(
          projectile.x - monster.x,
          projectile.y - monster.y
        );
        if (distance - monster.hitBox - projectile.radius < 1) {
          player.projectiles.splice(projectileIndex, 1);
          !monster.isTakingDame ? monster.takingDamage(projectile.force) : null;
          return;
        }
      });
      projectile.update(ctxScreen);
      if (
        projectile.x + projectile.radius < 1 ||
        projectile.y + projectile.radius < 1 ||
        projectile.x - projectile.radius > gameScreen.width ||
        projectile.y - projectile.radius > gameScreen.height
      ) {
        setTimeout(() => {
          player.projectiles.splice(projectileIndex, 1);
        });
      }
    });
  });

  pauseDelta = 0;
  requestAnimationFrame(animate);
}

export function cleanMap() {
  for (let row = 0; row < mapSizeY; row++) {
    for (let column = 0; column < mapSizeX; column++) {
      let tile = tileMap.map[row][column];
      if (tile === "green") {
        tileMap.map[row][column] = "0";
      }
    }
  }
}

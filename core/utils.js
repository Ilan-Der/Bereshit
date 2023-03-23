import {
  tileMap,
  tileSize,
  monsters,
  selectedBtn,
  ctxScreen,
  inversePause,
  cleanMap,
  canvasScreen,
  gameScreen,
  sideScreen,
  soundMute,
} from "../app.js";
import { mapSizeX, mapSizeY } from "../level/map.js";
import {
  drawBackGameBackground,
  drawSideScreenBackground,
} from "../UI/ScreenInit.js";
import { SOLID_ELEMENTS } from "./constants/tiles.js";
import { ASSETS } from "./loadAssets.js";

function possibilityForClick() {
  let monsterTiles = [];
  for (let i = 0; i < monsters.length; i++) {
    const monster = monsters[i];
    if (tileMap.map[monster.position.y][monster.position.x] !== "0") {
      continue;
    }
    if (
      monsters[i].stats.type === "ground"
      // tileMap.map[monster.position.y][monster.position.x] === 0
    ) {
      monsterTiles.push(monster.position);
    }
  }
  if (SOLID_ELEMENTS.includes(selectedBtn.type)) {
    for (let row = 0; row < mapSizeY; row++) {
      for (let column = 0; column < mapSizeX; column++) {
        let tileCoordinate = {
          x: column,
          y: row,
          value: tileMap.map[row][column],
        };
        if (
          monsterTiles.some(
            (e) => e.x === tileCoordinate.x && e.y === tileCoordinate.y
          )
        ) {
          tileMap.map[row][column] = "monster";
        }
        let tile = tileMap.map[row][column];
        if (
          tile === "0" &&
          !(
            row === 0 ||
            row === mapSizeY - 1 ||
            column === 0 ||
            column === mapSizeX - 1
          )
        ) {
          tileMap.map[row][column] = "green";
        }
        if (
          monsterTiles.some(
            (e) => e.x === tileCoordinate.x && e.y === tileCoordinate.y
          )
        ) {
          tileMap.map[row][column] = "0";
        }
      }
    }
  }
  if (selectedBtn.type === "spawnPoints") {
    for (let row = 0; row < mapSizeY; row++) {
      for (let column = 0; column < mapSizeX; column++) {
        let tile = tileMap.map[row][column];
        if (
          tile !== "spawnPoints" &&
          tile !== "mountain" &&
          tile !== "tower" &&
          tile !== "temple" &&
          tile !== "star" &&
          tile !== "tree" &&
          (row === 0 ||
            row === mapSizeY - 1 ||
            column === 0 ||
            column === mapSizeX - 1)
        ) {
          tileMap.map[row][column] = "green";
        }
      }
    }
  }
}

export let speedFactor = 1;

export function updateSpeedFactore(newValue) {
  speedFactor = newValue;
}

export function calculateInterval(
  timestamp,
  valueToCompare,
  interval,
  delta = 0
) {
  return timestamp >= valueToCompare + interval / speedFactor + delta;
}

export { possibilityForClick };

export function getNumberOfElement(element) {
  if (!element) {
    return;
  }
  const array = tileMap.elements.find((e) => {
    return e.type === element.type;
  });
  if (array) {
    return array.element.length;
  }
  return 99;
}

export function updateNumberOfElement() {
  for (let element of tileMap.elements) {
    let text = document.getElementById(`${element.type + "Number"}`);
    text.innerText = element.element.length;
  }
}

function isCardAuthorized(element) {
  return tileMap.elements.some(
    (e) => e.type === element.type && e.element.length < element.maximum
  );
}

export function renderScreenOnce() {
  ctxScreen.clearRect(0, 0, canvasScreen.width, canvasScreen.height);
  drawBackGameBackground(ctxScreen, gameScreen);
  drawSideScreenBackground(ctxScreen, gameScreen, sideScreen);
  tileMap.players[0].draw(ctxScreen);
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
  cleanMap();
  selectedBtn ? possibilityForClick() : null;

  tileMap.draw(ctxScreen);

  for (let i = 0; i < monsters.length; i++) {
    const monster = monsters[i];
    monster.draw(ctxScreen);
  }
}

export function playSound(sound) {
  if (soundMute) {
    return;
  }
  sound === "addTile" ? (ASSETS[sound].volume = 0.5) : null;
  sound === "thunderStrike" ? (ASSETS[sound].volume = 0.2) : null;
  sound === "bombSound" ? (ASSETS[sound].volume = 0.3) : null;
  ASSETS[sound].play();
}

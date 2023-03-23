import {
  cleanMap,
  isGod,
  selectedBtn,
  tileMap,
  inversePause,
  updateSelectedBtn,
  monsters,
  particles,
  pixelUnit,
  lowResources,
  emptyLowResourcesArray,
  gameScreen,
  isPause,
  updatePause,
} from "../app.js";
import { bombMecanics } from "../level/element/bomb.js";
import { mapSizeX, mapSizeY } from "../level/map.js";
import { Thunder } from "../player/thunder.js";
import { Particle } from "../player/visualEffects.js";
import { cardButtons } from "../UI/card-creation.js";
import { renderCardDescription } from "../UI/card-description.js";
import { marginLeft, marginTop } from "../UI/ScreenInit.js";
import { CARD_ELEMENTS, SOLID_ELEMENTS } from "./constants/tiles.js";
import { ASSETS } from "./loadAssets.js";
import { LowResource } from "./lowResource.js";
import { getNumberOfElement, playSound } from "./utils.js";

export const thunders = [];

export function handleClick(event) {
  if (event.x > gameScreen.width) {
    return;
  }
  if (selectedBtn) {
    CARD_ELEMENTS.some((card) => card.type === selectedBtn.type);
  }
  const cardSelected = selectedBtn
    ? CARD_ELEMENTS.find((card) => {
        return card.type === selectedBtn.type;
      })
    : null;

  const xZero = marginLeft;
  const yZero = marginTop;
  const x = event.x - xZero;
  const y = event.y - yZero;
  const clickPositionInGrid = tileMap.getPosition(x, y);
  if (
    clickPositionInGrid.x === Math.floor(mapSizeX / 2) &&
    clickPositionInGrid.y === Math.floor(mapSizeY / 2)
  ) {
    const isPaused = isPause;
    const closeButton = document.getElementById("closeButton");
    closeButton ? closeButton.click() : null;
    setTimeout(() => {
      isPaused ? updatePause(true) : updatePause(false);
    }, 150);
    updateSelectedBtn({ type: "godTile" });
    renderCardDescription(selectedBtn);
    return;
  } else if (selectedBtn && selectedBtn.type === "godTile") {
    updateSelectedBtn(undefined);
    renderCardDescription(selectedBtn);
    updatePause(false);
  }
  if (
    (selectedBtn &&
      selectedBtn.value > tileMap.players[0].stats.soulResource)
  ) {
    lowResources.push(new LowResource("resource"));
    return;
  }

  if (
    cardSelected &&
    getNumberOfElement(cardSelected) >=
      cardSelected.maximum + cardSelected.increaseBy &&
    !isGod
  ) {
    lowResources.push(new LowResource("maxTile"));
    return;
  }

  if (
    tileMap.map[clickPositionInGrid.y][clickPositionInGrid.x] === "green" &&
    CARD_ELEMENTS.some((card) => card.type === selectedBtn.type) &&
    (getNumberOfElement(cardSelected) <
      cardSelected.maximum + +cardSelected.increaseBy ||
      isGod)
  ) {
    emptyLowResourcesArray();
    tileMap.map[clickPositionInGrid.y][clickPositionInGrid.x] =
      selectedBtn.type;
    tileMap.players[0].stats.soulResource -= parseInt(selectedBtn.value);
    tileMap.players[0].updateHp(true);
    cleanMap();
    updateSelectedBtn(undefined);
    renderCardDescription(selectedBtn);
    const closeButton = document.getElementById("closeButton");
    if (closeButton) {
      closeButton.remove();
    }
    monsters.forEach((monster) => {
      monster.findingPath();
    });
    playSound("addTileSound");

    inversePause();
    for (let button of cardButtons) {
      button.disabled === true ? (button.disabled = false) : null;
    }
  }
  if (
    selectedBtn &&
    selectedBtn.type === "thunder" &&
    selectedBtn.value <= tileMap.players[0].stats.soulResource &&
    tileMap.players[0].stats.soulResource >= 0
  ) {
    const thunder = new Thunder(x, y);
    thunders.push(thunder);
    playSound("thunderStrike");
    tileMap.players[0].stats.soulResource -= parseInt(selectedBtn.value);
    updateSelectedBtn(undefined);
    renderCardDescription(selectedBtn);
    const closeButton = document.getElementById("closeButton");
    if (closeButton) {
      closeButton.remove();
    }
    inversePause();
    for (let button of cardButtons) {
      button.disabled === true ? (button.disabled = false) : null;
    }
  }

  if (
    selectedBtn &&
    selectedBtn.type === "bomb" &&
    SOLID_ELEMENTS.includes(
      tileMap.map[clickPositionInGrid.y][clickPositionInGrid.x]
    ) &&
    selectedBtn.value <= tileMap.players[0].stats.soulResource &&
    tileMap.players[0].stats.soulResource >= 0
  ) {
    tileMap.map[clickPositionInGrid.y][clickPositionInGrid.x] =
      selectedBtn.type;
    bombMecanics(clickPositionInGrid);
    tileMap.players[0].updateHp(true);
    tileMap.players[0].stats.soulResource -= parseInt(selectedBtn.value);
    updateSelectedBtn(undefined);
    renderCardDescription(selectedBtn);
    const closeButton = document.getElementById("closeButton");
    if (closeButton) {
      closeButton.remove();
    }
    inversePause();
    for (let button of cardButtons) {
      button.disabled === true ? (button.disabled = false) : null;
    }
    for (let i = 0; i < 40; i++) {
      particles.push(
        new Particle(x, y, Math.random() * 2 * pixelUnit, {
          x: Math.random() - 0.5,
          y: Math.random() - 0.5,
        },"white")
      );
    }
  }
}

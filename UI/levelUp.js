import {
  tileMap,
  tileSize,
  pixelUnit,
  inversePause,
  inverseLeveUp,
} from "../app.js";
import { generateSpawn } from "../player/NPCs/spawn.js";
import { ASSETS } from "../core/loadAssets.js";
import { playSound } from "../core/utils.js";
import { CARD_FOR_LEVEL_UP } from "../core/constants/cardForLevelUp.js";

const choices = 2;

function levelUpScreen() {
  let buttons = [];

  tileMap.players[0].level++;
  const levelUpScreen = document.getElementById("levelUpScreen");

  levelUpScreen.classList.remove("disable");
  for (let card = 0; card < choices; card++) {
    drawCards(levelUpScreen, buttons);
  }
}

function drawCards(levelUpScreen, buttons) {
  const buttonSize = { width: 384 * pixelUnit, height: 128 * pixelUnit };

  let cardForSelectionArray = [];

  CARD_FOR_LEVEL_UP.forEach((card) => {
    cardForSelectionArray.push(new card());
  });

  const cardBonusForSelection = cardForSelectionArray.filter((card) => {
    return card.bonusType === "bonus";
  });
  const cardPenaltyForSelection = cardForSelectionArray.filter((card) => {
    return card.bonusType === "penalty";
  });
  let cardBonus =
    cardBonusForSelection[
      Math.floor(Math.random() * cardBonusForSelection.length)
    ];
  let cardPenalty =
    cardPenaltyForSelection[
      Math.floor(Math.random() * cardPenaltyForSelection.length)
    ];

  while (
    cardBonus.tile === cardPenalty.tile &&
    cardPenalty.bonus === cardPenalty.bonus
  ) {
    cardPenalty =
      cardPenaltyForSelection[
        Math.floor(Math.random() * cardPenaltyForSelection.length)
      ];
  }

  const cardImg = ASSETS["cardLevelUp"].cloneNode();
  const newButton = document.createElement("button");
  newButton.classList.add("cardForLevelUp");

  const bonus = tileSize;

  levelUpScreen.appendChild(newButton);
  newButton.appendChild(cardImg);
  cardImg.style.width = "100%";
  cardImg.style.height = "100%";
  newButton.id = `cardLevelUp_${buttons.length}`;
  newButton.style.width = `${buttonSize.width}px`;
  newButton.style.height = `${buttonSize.height}px !important`;

  newButton.style.width = `${buttonSize.width}px`;
  newButton.style.height = `${buttonSize.height}px`;

  const cardBonusTile = document.createElement("img");
  newButton.append(cardBonusTile);
  cardBonusTile.src = `./src/images/${cardBonus.tile}.png`;
  cardBonusTile.style.width = `${tileSize * 2}px`;
  cardBonusTile.style.height = `${tileSize * 2}px`;
  cardBonusTile.style.top = `${0 * pixelUnit}px`;
  cardBonusTile.style.left = `${0 * pixelUnit}px`;

  const cardBonusType = document.createElement("img");
  newButton.append(cardBonusType);
  cardBonusType.src = `./src/images/${cardBonus.bonus}Icon.png`;
  cardBonusType.style.width = `${bonus}px`;
  cardBonusType.style.height = `${bonus}px`;
  cardBonusType.style.left = `${tileSize * 2.5}px`;
  cardBonusType.style.top = `${tileSize / 2}px`;

  const cardBonusDescription = document.createElement("p");
  newButton.append(cardBonusDescription);
  cardBonusDescription.innerHTML = cardBonus.description;
  cardBonusDescription.style.width = `${
    buttonSize.width - tileSize * 4 - 4 * pixelUnit
  }px`;
  cardBonusDescription.style.height = `${buttonSize.height / 2}px`;
  cardBonusDescription.style.top = `${0}px`;
  cardBonusDescription.style.left = `${tileSize * 4}px`;
  cardBonusDescription.style.textAlign = "center";
  cardBonusDescription.style.fontSize = `${9 * pixelUnit}px`;
  cardBonusDescription.style.lineHeight = `${tileSize / 2}px`;

  const cardPenaltyTile = document.createElement("img");
  newButton.append(cardPenaltyTile);
  cardPenaltyTile.src = `./src/images/${cardPenalty.tile}.png`;
  cardPenaltyTile.style.width = `${tileSize * 2}px`;
  cardPenaltyTile.style.height = `${tileSize * 2}px`;
  cardPenaltyTile.style.top = `${tileSize * 2}px`;
  cardPenaltyTile.style.left = `${0 * pixelUnit}px`;

  const cardPenaltyType = document.createElement("img");
  newButton.append(cardPenaltyType);
  cardPenaltyType.src = `./src/images/${cardPenalty.bonus}Icon.png`;
  cardPenaltyType.style.width = `${bonus}px`;
  cardPenaltyType.style.height = `${bonus}px`;
  cardPenaltyType.style.left = `${tileSize * 2.5}px`;
  cardPenaltyType.style.top = `${tileSize * 2.5}px`;

  const cardPenaltyDescription = document.createElement("p");
  newButton.append(cardPenaltyDescription);
  cardPenaltyDescription.innerHTML = cardPenalty.description;
  cardPenaltyDescription.style.width = `${
    buttonSize.width - tileSize * 4 - 4 * pixelUnit
  }px`;
  cardPenaltyDescription.style.height = `${buttonSize.height / 2}px`;
  cardPenaltyDescription.style.top = `${buttonSize.height / 2}px`;
  cardPenaltyDescription.style.left = `${tileSize * 4}px`;
  cardPenaltyDescription.style.textAlign = "center";
  cardPenaltyDescription.style.fontSize = `${9 * pixelUnit}px`;
  cardPenaltyDescription.style.lineHeight = `${tileSize / 2}px`;

  newButton.onclick = () => {
    cardBonus.function();
    cardPenalty.function();
    generateSpawn();
    levelUpScreen.classList.add("disable");
    playSound("clic");
    inverseLeveUp();
    inversePause();
    levelUpScreen.innerHTML = "";
  };

  buttons.push(newButton);
}

export { levelUpScreen };

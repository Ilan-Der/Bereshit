import {
  inversePause,
  ctxScreen,
  tileMap,
  tileSize,
  isPause,
  cleanMap,
  updateSelectedBtn,
  pixelUnit,
  selectedBtn,
  updatePause,
  sideScreen,
  emptyLowResourcesArray,
} from "../app.js";
import { CARD_ELEMENTS, SOLID_ELEMENTS } from "../core/constants/tiles.js";
import { possibilityForClick, renderScreenOnce } from "../core/utils.js";
import { updateStatusText } from "./actionButtons.js";
import { renderCardDescription } from "./card-description.js";

export let cardButtons = [];
let line = 0;

export function resetCardContainer() {
  cardButtons = [];
  line = 0;
}
const maxCardPerLign = 5;

const cardDeck = [
  "mountain",
  "temple",
  "tree",
  "tower",
  "desert",
  "lava",
  "river",
  "star",
  "bomb",
  "thunder",
];

function drawCards() {
  for (let card = 0; card < cardDeck.length; card++) {
    createCard(cardDeck[card]);
  }
}

const imgPosition = "16";

function createCard(type) {
  const cardSelected = CARD_ELEMENTS.find((card) => {
    return card.type === type;
  });
  const containerMargin = 16;
  const buttonSize = { width: 60 * pixelUnit, height: 64 * pixelUnit };
  const buttonContainer = document.getElementById("buttonContainer");
  buttonContainer.style.height = `${buttonSize.height * 2 + 8 * pixelUnit}px`;
  buttonContainer.style.width = `${
    sideScreen.width - tileSize - 4 * pixelUnit
  }px`;
  buttonContainer.style.margin = `0px ${containerMargin * pixelUnit}px`;
  let Xpos = (cardButtons.length % maxCardPerLign) * buttonSize.width;
  line =
    (cardButtons.length % maxCardPerLign) * buttonSize.width ? line : line + 1;
  let Ypos = buttonSize.height * (line - 1) + 4 * pixelUnit;

  let newButton = document.createElement("button");
  buttonContainer.appendChild(newButton);
  newButton.id = `${type + cardButtons.length}`;
  newButton.classList.add("buttonsTile");
  newButton.style.position = "absolute";
  newButton.style.left = `${Xpos}px`;
  newButton.style.top = `${Ypos}px`;

  const btnImage = new Image();
  btnImage.src = `./src/images/${type}.png`;
  newButton.appendChild(btnImage);
  btnImage.style.position = "absolute";
  btnImage.style.width = `${32 * pixelUnit}px`;
  btnImage.style.height = `${32 * pixelUnit}px`;
  btnImage.style.left = `${imgPosition * pixelUnit}px`;
  btnImage.style.top = `${16 * pixelUnit}px`;

  newButton.style.backgroundColor = "transparent";
  newButton.style.border = "none";
  newButton.style.width = `${buttonSize.width}px`;
  newButton.style.height = `${buttonSize.height}px`;

  let cardValueText = document.createElement("p");
  buttonContainer.appendChild(cardValueText);

  cardValueText.innerText = `${cardSelected.value}`;
  cardValueText.style.position = "absolute";
  cardValueText.style.left = `${Xpos + tileSize / 2 + 1 * pixelUnit}px`;
  cardValueText.style.top = `${Ypos + 7 * pixelUnit}px`;
  cardValueText.style.width = `${buttonSize.width / 2}px`;
  cardValueText.style.display = "flex";
  cardValueText.style.justifyContent = "center";
  cardValueText.style.textAlign = "center";
  cardValueText.style.fontSize = `${5 * pixelUnit}px`;
  cardValueText.style.userSelect = "none";
  cardValueText.style.fontWeight = "bold";

  let cardTitleText = document.createElement("p");
  buttonContainer.appendChild(cardTitleText);

  cardTitleText.innerText = `${cardSelected.title}`;
  cardTitleText.style.position = "absolute";
  cardTitleText.style.left = `${Xpos + imgPosition * pixelUnit}px`;
  cardTitleText.style.top = `${Ypos + 54 * pixelUnit}px`;
  cardTitleText.style.width = `${32 * pixelUnit}px`;
  cardTitleText.style.height = `${10 * pixelUnit}px`;
  cardTitleText.style.textAlign = "center";
  cardTitleText.style.verticalAlign = "middle";
  cardTitleText.style.fontSize = `${4 * pixelUnit}px`;
  cardTitleText.style.display = "table-cell";
  cardTitleText.style.userSelect = "none";
  cardTitleText.style.fontWeight = "bold";

  cardButtons.push(newButton);

  newButton.onclick = function () {
    const closeBtn = document.getElementById("closeButton");
    if (selectedBtn && selectedBtn.type === "spawnPoints") {
      return;
    }
    for (let button of cardButtons) {
      button.disabled === true ? (button.disabled = false) : null;
    }

    updateSelectedBtn({ type: cardSelected.type, value: cardSelected.value });
    renderCardDescription(selectedBtn);
    renderScreenOnce();
    updatePause(true);
    updateStatusText(pixelUnit);
    createCloseButton(newButton);
    newButton.disabled = true;
    closeBtn ? closeBtn.remove() : null;
  };
}

function createCloseButton(newButton) {
  const closeButtonSize = 32 * pixelUnit;

  let closeButton = document.createElement("button");
  newButton.appendChild(closeButton);
  closeButton.id = "closeButton";
  closeButton.classList.add("buttonsTile");
  closeButton.style.position = "absolute";
  closeButton.style.left = `${imgPosition * pixelUnit}px`;
  closeButton.style.top = `${16 * pixelUnit}px`;
  closeButton.style.backgroundColor = "rgba(50,50,50,0.6)";
  closeButton.style.backgroundImage = `url(./src/images/closeButton.png)`;
  closeButton.style.border = "none";

  closeButton.style.width = `${closeButtonSize}px`;
  closeButton.style.height = `${closeButtonSize}px`;
  closeButton.onclick = function () {
    updateSelectedBtn(undefined);
    renderCardDescription(undefined);
    closeButton.remove();
    emptyLowResourcesArray();
    cleanMap();
    setTimeout(() => {
      updatePause(false);
      for (let button of cardButtons) {
        button.disabled === true ? (button.disabled = false) : null;
      }
    }, 100);
  };
}

export { drawCards, createCard };

import {
  gameScreen,
  lowResources,
  pixelUnit,
  selectedBtn,
  sideScreen,
  tileMap,
  tileSize,
} from "../app.js";
import { CARD_ELEMENTS } from "../core/constants/tiles.js";
import { BONUS } from "../core/constants/bonus.js";
import { ASSETS } from "../core/loadAssets.js";
import { LowResource } from "../core/lowResource.js";
import { getNumberOfElement, playSound } from "../core/utils.js";
import { marginLeft, marginTop } from "./ScreenInit.js";

function renderCardDescription(selectedCard = undefined) {
  const cardSelected = selectedCard
    ? CARD_ELEMENTS.find((card) => {
        return card.type === selectedCard.type;
      })
    : null;
  const cardDescription = document.getElementById("cardDescription");
  const containerMargin = 16;

  cardDescription.style.left = `${gameScreen.width + marginLeft}px`;
  cardDescription.style.width = `${
    sideScreen.width - tileSize - 4 * pixelUnit
  }px`;
  cardDescription.style.margin = `0px ${containerMargin * pixelUnit}px`;
  cardDescription.style.height = `${
    tileSize * 7 - containerMargin * pixelUnit
  }px`;
  cardDescription.style.bottom = `${marginTop + containerMargin * pixelUnit}px`;

  if (!selectedBtn || !selectedBtn.type) {
    cardDescription.innerHTML = "";
    return;
  }
  cardDescription.innerHTML = "";
  if (!cardSelected) {
    return;
  }
  let numberColor =
    getNumberOfElement(cardSelected) <
    cardSelected.maximum + cardSelected.increaseBy
      ? "black"
      : "red";

  const cardDescriptionHeader = document.createElement("div");
  cardDescription.appendChild(cardDescriptionHeader);
  cardDescriptionHeader.style.backgroundColor = "white";
  cardDescriptionHeader.style.position = "absolute";
  cardDescriptionHeader.style.width = `${tileSize * 9.5 - 12 * pixelUnit}px`;
  cardDescriptionHeader.style.height = `${tileSize}px`;
  cardDescriptionHeader.style.top = `${4 * pixelUnit}px`;
  cardDescriptionHeader.style.left = `${4 * pixelUnit}px`;

  const cardValue = document.createElement("p");
  cardDescriptionHeader.appendChild(cardValue);
  cardValue.innerHTML = cardSelected.value ? `${cardSelected.value}` : null;
  cardValue.style.color =
    selectedBtn.value <= tileMap.players[0].stats.soulResource
      ? "black"
      : "red";
  cardValue.style.position = "absolute";
  cardValue.style.fontSize = `${16 * pixelUnit}px`;
  cardValue.style.marginTop = `${3 * pixelUnit}px`;
  cardValue.style.width = `${tileSize * 1.5}px`;
  cardValue.style.height = `${tileSize}px`;
  cardValue.style.display = "flex";
  cardValue.style.alignItems = "center";
  cardValue.style.justifyContent = "center";

  const numberVsMax = document.createElement("div");
  cardDescriptionHeader.appendChild(numberVsMax);
  if (cardSelected.maximum) {
    numberVsMax.innerHTML = `<span style="color:${numberColor}">${getNumberOfElement(
      cardSelected
    )}</span>/${cardSelected.maximum + cardSelected.increaseBy}`;
  }
  numberVsMax.style.position = "absolute";
  numberVsMax.style.fontSize = `${14 * pixelUnit}px`;
  numberVsMax.style.height = `${tileSize}px`;
  numberVsMax.style.right = `${tileSize + 5 * pixelUnit}px`;
  numberVsMax.style.marginTop = `${4 * pixelUnit}px`;
  numberVsMax.style.display = "flex";
  numberVsMax.style.alignItems = "center";
  numberVsMax.style.justifyContent = "center";

  const cardDescriptionImg = ASSETS[cardSelected.type];
  cardDescriptionHeader.appendChild(cardDescriptionImg);
  cardDescriptionImg.style.position = "absolute";
  cardDescriptionImg.style.right = `0px`;
  cardDescriptionImg.style.top = `0px`;
  cardDescriptionImg.style.height = `${tileSize}px`;

  const cardDescriptionTitle = document.createElement("div");
  cardDescriptionHeader.append(cardDescriptionTitle);
  cardDescriptionTitle.innerHTML = `${cardSelected.title}`;
  cardDescriptionTitle.style.color = "rgba(50,50,50, 1)";
  cardDescriptionTitle.style.marginTop = `${9 * pixelUnit}px`;
  cardDescriptionTitle.style.fontSize = `${20 * pixelUnit}px`;
  cardDescriptionTitle.style.paddingLeft = `${tileSize * 1.5}px`;
  cardDescriptionTitle.style.height = `${tileSize}px`;

  renderCardDescriptionText(cardSelected);

  if (cardSelected.increaseMax) {
    const cardDescriptionFooter = document.createElement("div");
    cardDescription.appendChild(cardDescriptionFooter);
    cardDescriptionFooter.style.backgroundColor = "rgba(50,50,50,1)";
    cardDescriptionFooter.style.color = "white";
    cardDescriptionFooter.style.position = "absolute";
    cardDescriptionFooter.style.width = `${tileSize * 9.5 - 15 * pixelUnit}px`;
    cardDescriptionFooter.style.height = `${tileSize}px`;
    cardDescriptionFooter.style.top = `${
      tileSize * 7 - containerMargin * pixelUnit - 36 * pixelUnit
    }px`;
    cardDescriptionFooter.style.left = `${4 * pixelUnit}px`;
    cardDescriptionFooter.style.display = "flex";
    cardDescriptionFooter.style.alignItems = "center";
    cardDescriptionFooter.style.paddingLeft = `${4 * pixelUnit}px`;

    cardDescriptionFooter.style.fontSize = `${12 * pixelUnit}px`;

    const cardDescriptionFooterText = document.createElement("p");
    cardDescriptionFooter.appendChild(cardDescriptionFooterText);
    cardDescriptionFooterText.innerHTML = `Increase max tile for ${increaseCardCost(
      cardSelected
    )}`;

    const addTileBtn = document.createElement("button");
    addTileBtn.classList.add("addTileBtn");
    cardDescriptionFooter.appendChild(addTileBtn);
    addTileBtn.style.position = "absolute";
    addTileBtn.style.top = `0px`;
    addTileBtn.style.right = `${4 * pixelUnit}px`;
    addTileBtn.style.width = `${tileSize}px`;
    addTileBtn.style.height = `${tileSize}px`;
    addTileBtn.onclick = () => {
      playSound("clic");
      if (
        increaseCardCost(cardSelected) > tileMap.players[0].stats.soulResource
      ) {
        lowResources.push(new LowResource("resource"));
        return;
      }
      tileMap.players[0].stats.soulResource -= increaseCardCost(
        cardSelected,
        true
      );
      ++cardSelected.increaseBy;
      numberColor =
        getNumberOfElement(cardSelected) <
        cardSelected.maximum + cardSelected.increaseBy
          ? "black"
          : "red";
      numberVsMax.innerHTML = `<span style="color:${numberColor}">${getNumberOfElement(
        cardSelected
      )}</span>/${cardSelected.maximum + cardSelected.increaseBy}`;
      cardDescriptionFooterText.innerHTML = `Increase max tile for ${increaseCardCost(
        cardSelected,
        false
      )}`;
      tileMap.players[0].drawsoulResource();
    };
  }
}

export function increaseCardCost(cardSelected, update) {
  let cost = cardSelected.increaseMax;
  cost >= 9999 ? (cost = 9999) : cost;
  update ? (cardSelected.increaseMax += cardSelected.increaseMax * 0.5) : null;
  return Math.floor(cost);
}

let isDescText = true;

function renderCardDescriptionText(cardSelected) {
  const cardDescription = document.getElementById("cardDescription");

  const cardDescriptionText = document.createElement("div");
  cardDescription.append(cardDescriptionText);
  cardDescriptionText.style.position = "absolute";
  cardDescriptionText.style.color = "white";
  cardDescriptionText.style.width = `${tileSize * 8.5 - 16 * pixelUnit}px`;
  cardDescriptionText.style.height = `${tileSize * 3}px`;
  cardDescriptionText.style.top = `${tileSize * 1.5}px`;
  cardDescriptionText.style.left = `${8 * pixelUnit}px`;
  cardDescriptionText.style.lineHeight = `${tileSize / 2}px`;
  cardDescriptionText.style.fontSize = `${10 * pixelUnit}px`;
  isDescText
    ? (cardDescriptionText.innerHTML = `${cardSelected.description}`)
    : cardDescriptionStats(cardDescriptionText, cardSelected);
  cardDescriptionSwitchBtn(cardDescriptionText, cardSelected);
}

function cardDescriptionSwitchBtn(cardDescriptionText, cardSelected) {
  const switchBtn = document.createElement("button");
  const cardDescription = document.getElementById("cardDescription");
  cardDescription.appendChild(switchBtn);
  switchBtn.classList.add("switchBtn");
  switchBtn.style.width = `${tileSize}px`;
  switchBtn.style.height = `${tileSize}px`;
  const switchBtnImg = isDescText
    ? ASSETS["statsBtn"]
    : ASSETS["descriptionBtn"];
  switchBtn.appendChild(switchBtnImg);
  switchBtn.style.top = `${tileSize + 8 * pixelUnit}px`;
  switchBtn.style.right = `${4 * pixelUnit}px`;

  switchBtn.onclick = () => {
    cardDescriptionText.innerHTML = "";
    isDescText = !isDescText;
    isDescText
      ? renderCardDescriptionText(cardSelected)
      : cardDescriptionStats(cardDescriptionText, cardSelected);
  };
}

function cardDescriptionStats(cardDescriptionText, cardSelected) {
  const statsIcon = [
    { type: "force", img: ASSETS["forceIcon"] },
    { type: "cooldown", img: ASSETS["cooldownIcon"] },
    { type: "range", img: ASSETS["rangeIcon"] },
    { type: "speed", img: ASSETS["speedIcon"] },
  ];

  const tileBonus = [
    {
      tile: "godTile",
      force: `${3 + BONUS.GOD_FORCE}`,
      cooldown: `${(1000 + BONUS.GOD_COOLDOWN) / 1000} sec`,
      range: `${2.5 + BONUS.GOD_RANGE / tileSize}`,
    },
    {
      tile: "tower",
      force: `${3 + BONUS.TOWER_FORCE}`,
      cooldown: `${(1000 + BONUS.TOWER_COOLDOWN) / 1000} sec`,
      range: `${2.5 + BONUS.TOWER_RANGE / tileSize}`,
    },
    {
      tile: "temple",
      force: `${5 + BONUS.TEMPLE_FORCE} resources`,
      cooldown: `${(50 + BONUS.TEMPLE_COOLDOWN) / 10} sec`,
    },
    {
      tile: "tree",
      force: `${1 + BONUS.TREE_FORCE} hp`,
      cooldown: `${(50 + BONUS.TREE_COOLDOWN) / 10} sec`,
    },
    {
      tile: "lava",
      force: `${3 + BONUS.LAVA_FORCE}`,
      cooldown: `${(1000 + BONUS.LAVA_COOLDOWN) / 1000} sec`,
    },
    {
      tile: "desert",
      speed: `${0.5 + BONUS.DESERT_SPEED}`,
    },
    {
      tile: "star",
      range: `${2.5 + BONUS.STAR_RANGE / tileSize}`,
    },
    {
      tile: "thunder",
      force: `${100 + BONUS.THUNDER_FORCE}`,
      range: `${2 + BONUS.THUNDER_RANGE / tileSize}`,
    },
  ];
  cardDescriptionText.classList.add("cardDescriptionText");
  cardDescriptionText.style.top = `${tileSize * 1.75}px`;

  const stat = cardSelected
    ? tileBonus.find((tile) => {
        return tile.tile === cardSelected.type;
      })
    : null;
  if (stat) {
    for (let i = 0; i < statsIcon.length; i++) {
      const icon = statsIcon[i];
      const statElement = document.createElement("div");
      statElement.style.display = "flex";
      statElement.style.alignItems = "center";
      cardDescriptionText.appendChild(statElement);
      if (icon.type === "force" && stat.force) {
        statElement.appendChild(icon.img);
        const force = document.createElement("p");
        force.style.marginLeft = `${4 * pixelUnit}px`;
        force.innerHTML = `: ${stat.force}`;
        statElement.appendChild(force);
      }
      if (icon.type === "cooldown" && stat.cooldown) {
        statElement.appendChild(icon.img);
        const cooldown = document.createElement("p");
        cooldown.style.marginLeft = `${4 * pixelUnit}px`;
        cooldown.innerHTML = `: ${stat.cooldown}`;
        statElement.appendChild(cooldown);
      }
      if (icon.type === "range" && stat.range) {
        statElement.appendChild(icon.img);
        const range = document.createElement("p");
        range.style.marginLeft = `${4 * pixelUnit}px`;
        range.innerHTML = `: ${stat.range}`;
        statElement.appendChild(range);
      }
      if (icon.type === "speed" && stat.speed) {
        statElement.appendChild(icon.img);
        const speed = document.createElement("p");
        speed.style.marginLeft = `${4 * pixelUnit}px`;
        speed.innerHTML = `: ${stat.speed}`;
        statElement.appendChild(speed);
      }
      icon.img.style.width = `${tileSize / 2}px`;
      icon.img.style.height = `${tileSize / 2}px`;
      icon.img.style.marginBottom = `${tileSize / 3}px`;
      icon.img.style.marginLeft = `${tileSize / 4}px`;
    }
  }
  cardDescriptionSwitchBtn(cardDescriptionText, cardSelected);
}

export { renderCardDescription };

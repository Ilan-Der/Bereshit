window.addEventListener("onload", () => {
  // level/map.js
  var map = [];
  var mapSizeX = 21;
  var mapSizeY = 15;
  function createMap() {
    map = [];
    const mapCenterX = Math.floor(mapSizeX / 2);
    const mapCenterY = Math.floor(mapSizeY / 2);
    for (let i = 0; i < mapSizeY; i++) {
      map.push([]);
    }
    for (let row = 0; row < mapSizeY; row++) {
      for (let column = 0; column < mapSizeX; column++) {
        map[row].push("0");
      }
    }
    map[mapCenterY][mapCenterX] = "player";
  }

  // core/levelUp/bonus.js
  var BONUS = {
    TOWER_FORCE: 0,
    TOWER_COOLDOWN: 0,
    TOWER_RANGE: 0,
    GOD_FORCE: 0,
    GOD_COOLDOWN: 0,
    GOD_RANGE: 0,
    LAVA_FORCE: 0,
    STAR_RANGE: 0
  };
  function resetBonus() {
    for (let bonus in BONUS) {
      BONUS[bonus] = 0;
    }
  }

  // core/constants/tiles.js
  var CARD_ELEMENTS = [
    {
      type: "godTile",
      title: "GOD",
      description: "Our dear Lord.</br>This is US."
    },
    {
      type: "spawnPoints",
      value: -10,
      title: "Spawn",
      increaseBy: 0,
      increaseMax: 10,
      maximum: 999,
      description: "Generate a spawning point.</br>Monster will start to pop from it.</br>Posing this tile will generate 10 manas."
    },
    {
      type: "mountain",
      value: 5,
      title: "Mountain",
      increaseBy: 0,
      increaseMax: 10,
      maximum: 6,
      description: "A natural obstacle that will block path for any attacking monsters.</br></br>Each mountain increases the God's maximum HP."
    },
    {
      type: "thunder",
      value: 50,
      title: "Thunder",
      description: "Create a lightning that strike monsters and deals 10 damages to all monsters in its area."
    },
    {
      type: "river",
      value: 50,
      title: "River",
      increaseBy: 0,
      increaseMax: 50,
      maximum: 1,
      description: "The ground monster walking in it is drowned."
    },
    {
      type: "temple",
      value: 20,
      title: "Temple",
      increaseBy: 0,
      increaseMax: 10,
      maximum: 3,
      description: "Generate 5 mana every 5 seconds."
    },
    {
      type: "tower",
      value: 30,
      title: "Tower",
      increaseBy: 0,
      increaseMax: 10,
      maximum: 4,
      description: "A tower that will shoot on monsters."
    },
    {
      type: "bomb",
      value: 20,
      title: "Bomb",
      description: "Destroy an element on the grid."
    },
    {
      type: "lava",
      value: 30,
      title: "Lava",
      increaseBy: 0,
      increaseMax: 10,
      maximum: 4,
      description: "Any monster that pass through it take damage."
    },
    {
      type: "desert",
      value: 30,
      title: "Desert",
      increaseBy: 0,
      increaseMax: 10,
      maximum: 4,
      description: "Any monster that pass through it are slowed down."
    },
    {
      type: "tree",
      value: 100,
      title: "Tree",
      increaseBy: 0,
      increaseMax: 10,
      maximum: 4,
      description: "Heal 1 HP every 5 seconds."
    },
    {
      type: "star",
      value: 20,
      title: "Star",
      increaseBy: 0,
      increaseMax: 10,
      maximum: 4,
      description: "Force monster to follow their path."
    }
  ];
  function resetTileCards() {
    for (let card of CARD_ELEMENTS) {
      card.increaseBy = 0;
    }
  }
  var SOLID_ELEMENTS = [
    "mountain",
    "river",
    "tower",
    "temple",
    "desert",
    "tree",
    "lava",
    "star"
  ];
  var FRANCHISSABLE_ELEMENTS = ["lava", "river", "desert", "star"];

  // core/utils.js
  function possibilityForClick() {
    let monsterTiles = [];
    for (let i = 0; i < monsters.length; i++) {
      const monster = monsters[i];
      if (tileMap.map[monster.position.y][monster.position.x] !== "0") {
        continue;
      }
      if (monsters[i].stats.type === "ground") {
        monsterTiles.push(monster.position);
      }
    }
    if (SOLID_ELEMENTS.includes(selectedBtn.type)) {
      for (let row = 0; row < mapSizeY; row++) {
        for (let column = 0; column < mapSizeX; column++) {
          let tileCoordinate = {
            x: column,
            y: row,
            value: tileMap.map[row][column]
          };
          if (monsterTiles.some(
            (e) => e.x === tileCoordinate.x && e.y === tileCoordinate.y
          )) {
            tileMap.map[row][column] = "monster";
          }
          let tile = tileMap.map[row][column];
          if (tile === "0" && !(row === 0 || row === mapSizeY - 1 || column === 0 || column === mapSizeX - 1)) {
            tileMap.map[row][column] = "green";
          }
          if (monsterTiles.some(
            (e) => e.x === tileCoordinate.x && e.y === tileCoordinate.y
          )) {
            tileMap.map[row][column] = "0";
          }
        }
      }
    }
    if (selectedBtn.type === "spawnPoints") {
      for (let row = 0; row < mapSizeY; row++) {
        for (let column = 0; column < mapSizeX; column++) {
          let tile = tileMap.map[row][column];
          if (tile !== "spawnPoints" && tile !== "mountain" && tile !== "tower" && tile !== "temple" && tile !== "star" && tile !== "tree" && (row === 0 || row === mapSizeY - 1 || column === 0 || column === mapSizeX - 1)) {
            tileMap.map[row][column] = "green";
          }
        }
      }
    }
  }
  var speedFactor = 1;
  function updateSpeedFactore(newValue) {
    speedFactor = newValue;
  }
  function calculateInterval(timestamp, valueToCompare, interval, delta2 = 0) {
    return timestamp >= valueToCompare + interval / speedFactor + delta2;
  }
  function getNumberOfElement(element) {
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
  function renderScreenOnce() {
    ctxScreen.clearRect(0, 0, canvasScreen2.width, canvasScreen2.height);
    drawBackGameBackground(ctxScreen, gameScreen);
    drawSideScreenBackground(ctxScreen, gameScreen, sideScreen);
    tileMap.players[0].draw(ctxScreen);
    for (let i = 0; i < tileMap.spawnPoints.length; i++) {
      const spawnPoint = tileMap.spawnPoints[i];
      spawnPoint.update(ctxScreen);
    }
    cleanMap();
    selectedBtn ? possibilityForClick() : null;
    tileMap.draw(ctxScreen);
    for (let i = 0; i < monsters.length; i++) {
      const monster = monsters[i];
      monster.draw(ctxScreen);
    }
  }
  function playSound(sound) {
    if (soundMute) {
      return;
    }
    sound === "addTile" ? ASSETS[sound].volume = 0.5 : null;
    sound === "thunderStrike" ? ASSETS[sound].volume = 0.2 : null;
    sound === "bombSound" ? ASSETS[sound].volume = 0.3 : null;
    ASSETS[sound].play();
  }

  // core/lowResource.js
  var LowResource = class {
    constructor(type) {
      this.width = gameScreen.width;
      this.x = marginLeft + canvasScreen2.width / 2 - this.width / 2;
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
    update(delta2) {
      const previousText = document.getElementById("lowResource");
      previousText ? previousText.remove() : null;
      const text = document.createElement("p");
      text.id = "lowResource";
      text.classList.add("lowResource");
      const gameScreen2 = document.getElementById("gameScreen");
      gameScreen2.appendChild(text);
      text.innerHTML = this.text;
      text.style.position = "absolute";
      text.style.width = `${this.width}px`;
      text.style.height = `${tileSize}px`;
      text.style.fontSize = `${tileSize * 3 / 4}px`;
      text.style.color = `rgba(230,85,85,${this.opacity})`;
      text.style.backgroundColor = `rgba(0,0,0,${this.opacity})`;
      text.style.top = `${this.y}px`;
      this.opacity -= 0.01 * delta2;
      this.y -= 0.5 * pixelUnit * delta2;
    }
  };

  // UI/card-description.js
  function renderCardDescription(selectedCard = void 0) {
    const cardSelected = selectedCard ? CARD_ELEMENTS.find((card) => {
      return card.type === selectedCard.type;
    }) : null;
    const cardDescription = document.getElementById("cardDescription");
    const containerMargin = 16;
    cardDescription.style.left = `${gameScreen.width + marginLeft}px`;
    cardDescription.style.width = `${sideScreen.width - tileSize - 4 * pixelUnit}px`;
    cardDescription.style.margin = `0px ${containerMargin * pixelUnit}px`;
    cardDescription.style.height = `${tileSize * 7 - containerMargin * pixelUnit}px`;
    cardDescription.style.bottom = `${marginTop + containerMargin * pixelUnit}px`;
    if (!selectedBtn || !selectedBtn.type) {
      cardDescription.innerHTML = "";
      return;
    }
    cardDescription.innerHTML = "";
    if (!cardSelected) {
      return;
    }
    let numberColor = getNumberOfElement(cardSelected) < cardSelected.maximum + cardSelected.increaseBy ? "black" : "red";
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
    cardValue.style.color = selectedBtn.value <= tileMap.players[0].stats.soulResource ? "black" : "red";
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
      cardDescriptionFooter.style.top = `${tileSize * 7 - containerMargin * pixelUnit - 36 * pixelUnit}px`;
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
        if (increaseCardCost(cardSelected) > tileMap.players[0].stats.soulResource) {
          lowResources.push(new LowResource("resource"));
          return;
        }
        tileMap.players[0].stats.soulResource -= increaseCardCost(
          cardSelected,
          true
        );
        ++cardSelected.increaseBy;
        numberColor = getNumberOfElement(cardSelected) < cardSelected.maximum + cardSelected.increaseBy ? "black" : "red";
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
  function increaseCardCost(cardSelected, update) {
    let cost = cardSelected.increaseMax;
    cost >= 9999 ? cost = 9999 : cost;
    update ? cardSelected.increaseMax += cardSelected.increaseMax * 0.5 : null;
    return Math.floor(cost);
  }
  var isDescText = true;
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
    isDescText ? cardDescriptionText.innerHTML = `${cardSelected.description}` : cardDescriptionStats(cardDescriptionText, cardSelected);
    cardDescriptionSwitchBtn(cardDescriptionText, cardSelected);
  }
  function cardDescriptionSwitchBtn(cardDescriptionText, cardSelected) {
    const switchBtn = document.createElement("button");
    const cardDescription = document.getElementById("cardDescription");
    cardDescription.appendChild(switchBtn);
    switchBtn.classList.add("switchBtn");
    switchBtn.style.width = `${tileSize}px`;
    switchBtn.style.height = `${tileSize}px`;
    const switchBtnImg = isDescText ? ASSETS["statsBtn"] : ASSETS["descriptionBtn"];
    switchBtn.appendChild(switchBtnImg);
    switchBtn.style.top = `${tileSize + 8 * pixelUnit}px`;
    switchBtn.style.right = `${4 * pixelUnit}px`;
    switchBtn.onclick = () => {
      cardDescriptionText.innerHTML = "";
      isDescText = !isDescText;
      isDescText ? renderCardDescriptionText(cardSelected) : cardDescriptionStats(cardDescriptionText, cardSelected);
    };
  }
  function cardDescriptionStats(cardDescriptionText, cardSelected) {
    const statsIcon = [
      { type: "force", img: ASSETS["forceIcon"] },
      { type: "cooldown", img: ASSETS["cooldownIcon"] },
      { type: "range", img: ASSETS["rangeIcon"] },
      { type: "speed", img: ASSETS["speedIcon"] }
    ];
    const tileBonus = [
      {
        tile: "godTile",
        force: `${3 + BONUS.GOD_FORCE}`,
        cooldown: `${(1e3 + BONUS.GOD_COOLDOWN) / 1e3} sec`,
        range: `${2.5 + BONUS.GOD_RANGE / tileSize}`
      },
      {
        tile: "tower",
        force: `${3 + BONUS.TOWER_FORCE}`,
        cooldown: `${(1e3 + BONUS.TOWER_COOLDOWN) / 1e3} sec`,
        range: `${2.5 + BONUS.TOWER_RANGE / tileSize}`
      },
      {
        tile: "temple",
        force: `${5} hp`,
        cooldown: `${5e3 / 1e3} sec`
      },
      {
        tile: "tree",
        force: `${5} hp`,
        cooldown: `${5e3 / 1e3} sec`
      },
      {
        tile: "lava",
        force: `${3 + BONUS.LAVA_FORCE}`,
        cooldown: `${1e3 / 1e3} sec`
      },
      {
        tile: "desert",
        speed: `${0.5}`
      },
      {
        tile: "star",
        range: `${2.5 + BONUS.STAR_RANGE / tileSize}`
      },
      {
        tile: "thunder",
        force: `${100}`,
        range: `${2}`
      }
    ];
    cardDescriptionText.classList.add("cardDescriptionText");
    cardDescriptionText.style.top = `${tileSize * 1.75}px`;
    const stat = cardSelected ? tileBonus.find((tile) => {
      return tile.tile === cardSelected.type;
    }) : null;
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

  // UI/card-creation.js
  var cardButtons = [];
  var line = 0;
  function resetCardContainer() {
    cardButtons = [];
    line = 0;
  }
  var maxCardPerLign = 5;
  var cardDeck = [
    "mountain",
    "temple",
    "tree",
    "tower",
    "desert",
    "lava",
    "river",
    "star",
    "bomb",
    "thunder"
  ];
  function drawCards() {
    for (let card = 0; card < cardDeck.length; card++) {
      createCard(cardDeck[card]);
    }
  }
  var imgPosition = "16";
  function createCard(type) {
    const cardSelected = CARD_ELEMENTS.find((card) => {
      return card.type === type;
    });
    const containerMargin = 16;
    const buttonSize = { width: 60 * pixelUnit, height: 64 * pixelUnit };
    const buttonContainer = document.getElementById("buttonContainer");
    buttonContainer.style.height = `${buttonSize.height * 2 + 8 * pixelUnit}px`;
    buttonContainer.style.width = `${sideScreen.width - tileSize - 4 * pixelUnit}px`;
    buttonContainer.style.margin = `0px ${containerMargin * pixelUnit}px`;
    let Xpos = cardButtons.length % maxCardPerLign * buttonSize.width;
    line = cardButtons.length % maxCardPerLign * buttonSize.width ? line : line + 1;
    let Ypos = buttonSize.height * (line - 1) + 4 * pixelUnit;
    let newButton = document.createElement("button");
    buttonContainer.appendChild(newButton);
    newButton.id = `${type + cardButtons.length}`;
    newButton.classList.add("buttonsTile");
    newButton.style.position = "absolute";
    newButton.style.left = `${Xpos}px`;
    newButton.style.top = `${Ypos}px`;
    const btnImage = new Image();
    btnImage.src = `./assets/src/images/${type}.png`;
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
    newButton.onclick = function() {
      const closeBtn = document.getElementById("closeButton");
      if (selectedBtn && selectedBtn.type === "spawnPoints") {
        return;
      }
      for (let button of cardButtons) {
        button.disabled === true ? button.disabled = false : null;
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
    closeButton.style.backgroundImage = `url(./assets/src/images/closeButton.png)`;
    closeButton.style.border = "none";
    closeButton.style.width = `${closeButtonSize}px`;
    closeButton.style.height = `${closeButtonSize}px`;
    closeButton.onclick = function() {
      updateSelectedBtn(void 0);
      renderCardDescription(void 0);
      closeButton.remove();
      emptyLowResourcesArray();
      cleanMap();
      setTimeout(() => {
        updatePause(false);
        for (let button of cardButtons) {
          button.disabled === true ? button.disabled = false : null;
        }
      }, 100);
    };
  }

  // UI/actionButtons.js
  function createActionButton(pixelUnit2) {
    const actionStatus = window.document.getElementById("actionStatus");
    actionStatus.classList.remove("disable");
    actionStatus.innerHTML = `<span style=font-size:${5 * pixelUnit2}px>x</span>1`;
    actionStatus.style.fontSize = `${8 * pixelUnit2}px`;
    const pauseButton = document.getElementById("pause");
    pauseButton.onclick = function() {
      if (!selectedBtn || selectedBtn.type === "godTile") {
        inversePause();
      }
      updateStatusText(pixelUnit2);
      handlePauseMenu();
    };
    const playButton = document.getElementById("play");
    playButton.onclick = function() {
      if (isPause && !selectedBtn || selectedBtn && selectedBtn.type === "godTile") {
        updatePause(false);
      }
      if (!selectedBtn) {
        updateSpeedFactore(1);
        updateStatusText(pixelUnit2);
      }
      if (selectedBtn) {
        const closeButton = document.getElementById("closeButton");
        closeButton ? closeButton.click() : null;
        cleanMap();
        updateSelectedBtn(void 0);
        renderCardDescription(selectedBtn);
        updatePause(false);
      }
    };
    const fastForwardButton = document.getElementById("fastForward");
    fastForwardButton.onclick = function() {
      if (isPause && !selectedBtn) {
        inversePause();
      }
      if (!selectedBtn) {
        updateSpeedFactore(2);
        updateStatusText(pixelUnit2);
      }
    };
    const actionButtons = document.getElementById("actionButtons");
    actionButtons.classList.remove("disable");
    actionButtons.style.height = `${tileSize}px`;
    actionButtons.style.width = `${tileSize * 3}px`;
    actionButtons.style.top = `${tileSize * 1.25 + marginTop}px`;
    actionButtons.style.left = `${marginLeft + canvasScreen.width - (tileSize * 3.5 - 2 * pixelUnit2)}px`;
    const pause = document.getElementById("pause");
    pause.style.width = `${tileSize}px`;
    pause.style.height = `${tileSize}px`;
    pause.style.left = `${marginLeft + canvasScreen.width - (tileSize * 3.5 - 2 * pixelUnit2)}px`;
    const play = document.getElementById("play");
    play.style.width = `${tileSize}px`;
    play.style.height = `${tileSize}px`;
    play.style.left = `${marginLeft + canvasScreen.width - (tileSize * 2.5 - 2 * pixelUnit2)}px`;
    const fastForward = document.getElementById("fastForward");
    fastForward.style.width = `${tileSize}px`;
    fastForward.style.height = `${tileSize}px`;
    fastForward.style.left = `${marginLeft + canvasScreen.width - (tileSize * 1.5 - 2 * pixelUnit2)}px`;
    actionStatus.style.top = `${tileSize * 2.4 + marginTop}px`;
    actionStatus.style.left = `${marginLeft + canvasScreen.width - tileSize * 3.5}px`;
    actionStatus.style.width = `${tileSize * 3}px`;
  }
  function updateStatusText(pixelUnit2) {
    const actionStatus = document.getElementById("actionStatus");
    speedFactor === 1 ? actionStatus.innerHTML = `<span style=font-size:${5 * pixelUnit2}px>x</span>1` : null;
    speedFactor === 2 ? actionStatus.innerHTML = `<span style=font-size:${5 * pixelUnit2}px>x</span>2` : null;
    isPause ? actionStatus.innerText = "pause" : null;
  }

  // UI/pauseMenu.js
  function handlePauseMenu() {
    const pauseMenu2 = document.getElementById("pauseMenu");
    if (isPause) {
      pauseMenu2.classList.remove("disable");
      const soundsOption = document.getElementById("soundsOption");
      soundsOption.classList.remove("disable");
      resetButton();
      resumeButton();
      musicMuteElement(tileSize, false);
      soundMuteElement(tileSize, false);
    }
  }
  function resetButton(isGameOver = false) {
    const yPos = isGameOver ? 9 : 7.5;
    const pauseMenu2 = document.getElementById("pauseMenu");
    const resetButton2 = document.getElementById("resetButton");
    const gameOverScreen2 = document.getElementById("gameOverScreen");
    resetButton2.classList.remove("disable");
    const resetButtonImg = new Image();
    resetButtonImg.src = "./assets/src/images/menuButtonStartAsGod.png";
    resetButton2.appendChild(resetButtonImg);
    resetButton2.classList.add("resetButton");
    resetButton2.style.height = `${tileSize}px`;
    resetButton2.style.width = `${tileSize * 6}px`;
    resetButton2.style.top = `${marginTop + tileSize * yPos}px`;
    resetButton2.style.left = `${marginLeft + canvasScreen.width / 2 - tileSize * 3}px`;
    resetButton2.style.fontSize = `${tileSize * 0.55}px`;
    resetButton2.style.padding = `${9.5 * pixelUnit}px`;
    resetButton2.onclick = () => {
      const buttonContainer = document.getElementById("buttonContainer");
      buttonContainer.innerHTML = "";
      updateSelectedBtn(void 0);
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
        gameOverScreen2 ? gameOverScreen2.classList.add("disable") : null;
        resetButton2.classList.add("disable");
        pauseMenu2.classList.add("disable");
        mainMenu.classList.remove("disable");
        mainMenuCanvas.classList.remove("disable");
      }, 100);
      playSound("clic");
    };
  }
  function resumeButton() {
    const resumeButton2 = document.getElementById("resumeButton");
    const resetButton2 = document.getElementById("resetButton");
    const resumeButtonImg = new Image();
    resumeButtonImg.src = "./assets/src/images/menuButtonStartAsGod.png";
    resumeButton2.appendChild(resumeButtonImg);
    resumeButton2.classList.add("resumeButton");
    resumeButton2.style.height = `${tileSize}px`;
    resumeButton2.style.width = `${tileSize * 6}px`;
    resumeButton2.style.top = `${marginTop + tileSize * 6}px`;
    resumeButton2.style.left = `${marginLeft + canvasScreen.width / 2 - tileSize * 3}px`;
    resumeButton2.style.fontSize = `${tileSize * 0.55}px`;
    resumeButton2.style.padding = `${9.5 * pixelUnit}px`;
    resumeButton2.onclick = () => {
      resetButton2.classList.add("disable");
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
  function musicMuteElement(tileSize2, isMain) {
    const yPos = isMain ? tileSize2 * 11.5 : tileSize2 * 9.5;
    const musicMuteElement2 = document.getElementById("musicMute");
    musicMuteElement2.style.top = `${marginTop + yPos}px`;
    musicMuteElement2.style.fontSize = `${tileSize2 * 0.55}px`;
    musicMuteElement2.style.width = `${tileSize2 * 5}px`;
    musicMuteElement2.style.left = `${marginLeft + canvasScreen.width / 2 - tileSize2 * 3}px`;
    const musicMuteButton = document.getElementById("musicMuteButton");
    musicMuteButton.style.height = `${tileSize2}px`;
    musicMuteButton.style.width = `${tileSize2}px`;
    let musicMuteButtonImg = !musicMute ? ASSETS["music"] : ASSETS["musicMute"];
    musicMuteButton.appendChild(musicMuteButtonImg);
    musicMuteButtonImg.style.height = `${tileSize2}px`;
    musicMuteButtonImg.style.width = `${tileSize2}px`;
    musicMuteButton.style.position = "absolute";
    musicMuteButton.style.right = `0px`;
    musicMuteButton.onclick = () => {
      musicMuteFunction();
      musicMuteButtonImg.remove();
      musicMuteButtonImg = !musicMute ? ASSETS["music"] : ASSETS["musicMute"];
      musicMuteButton.appendChild(musicMuteButtonImg);
      musicMuteButtonImg.style.height = `${tileSize2}px`;
      musicMuteButtonImg.style.width = `${tileSize2}px`;
      playSound("clic");
    };
  }
  function soundMuteElement(tileSize2, isMain) {
    const yPos = isMain ? tileSize2 * 13 : tileSize2 * 11;
    const soundMuteElement2 = document.getElementById("soundMute");
    soundMuteElement2.style.top = `${marginTop + yPos}px`;
    soundMuteElement2.style.fontSize = `${tileSize2 * 0.55}px`;
    soundMuteElement2.style.width = `${tileSize2 * 5}px`;
    soundMuteElement2.style.left = `${marginLeft + canvasScreen.width / 2 - tileSize2 * 3}px`;
    const soundMuteButton = document.getElementById("soundMuteButton");
    soundMuteButton.style.height = `${tileSize2}px`;
    soundMuteButton.style.width = `${tileSize2}px`;
    soundMuteButton.style.position = "absolute";
    soundMuteButton.style.right = `0px`;
    let soundMuteButtonImg = !soundMute ? ASSETS["sound"] : ASSETS["soundMute"];
    soundMuteButton.appendChild(soundMuteButtonImg);
    soundMuteButtonImg.style.height = `${tileSize2}px`;
    soundMuteButtonImg.style.width = `${tileSize2}px`;
    soundMuteButton.onclick = () => {
      soundMuteFunction();
      soundMuteButtonImg.remove();
      soundMuteButtonImg = !soundMute ? ASSETS["sound"] : ASSETS["soundMute"];
      soundMuteButton.appendChild(soundMuteButtonImg);
      soundMuteButtonImg.style.height = `${tileSize2}px`;
      soundMuteButtonImg.style.width = `${tileSize2}px`;
      playSound("clic");
    };
  }

  // UI/ScreenInit.js
  var screenRatio = 2 / 3;
  var marginTop = 0;
  var marginLeft = 0;
  function screenInit(canvasScreen3) {
    const screenWidth = innerWidth;
    const screenHeight = innerHeight;
    canvasScreen3.width = innerWidth;
    tileMap.tileSize = canvasScreen3.width * screenRatio / mapSizeX;
    let tileSize2 = tileMap.tileSize;
    canvasScreen3.height = mapSizeY * tileSize2;
    if (canvasScreen3.height > screenHeight) {
      canvasScreen3.height = screenHeight;
      tileMap.tileSize = canvasScreen3.height / mapSizeY;
      tileSize2 = tileMap.tileSize;
      canvasScreen3.width = mapSizeX * tileSize2 + mapSizeX * tileSize2 / 2;
      marginLeft = (screenWidth - canvasScreen3.width) / 2;
    }
    marginTop = screenHeight / 2 - canvasScreen3.height / 2;
    canvasScreen3.style.marginTop = `${marginTop}px`;
    canvasScreen3.style.marginLeft = `${marginLeft}px`;
    const gameScreen2 = {
      width: mapSizeX * tileSize2,
      height: mapSizeY * tileSize2
    };
    const sideScreen2 = {
      width: canvasScreen3.width - gameScreen2.width,
      height: canvasScreen3.height
    };
    const levelUpScreen2 = document.getElementById("levelUpScreen");
    levelUpScreen2.style.height = `${gameScreen2.height}px`;
    levelUpScreen2.style.width = `${gameScreen2.width + sideScreen2.width}px`;
    levelUpScreen2.style.top = `${marginTop}px`;
    levelUpScreen2.style.left = `${marginLeft}px`;
    const pixelUnit2 = tileSize2 / 32;
    const buttonContainer = document.getElementById("buttonContainer");
    buttonContainer.style.left = `${gameScreen2.width + marginLeft}px`;
    buttonContainer.style.width = `${sideScreen2.width}px`;
    buttonContainer.style.top = `${tileSize2 * 3 + marginTop}px`;
    const mainMenu2 = document.getElementById("mainMenu");
    const mainMenuP = mainMenu2.querySelector("p");
    mainMenuP.style.fontSize = `${14 * pixelUnit2}px`;
    mainMenuP.style.lineHeight = `${24 * pixelUnit2}px`;
    const mainMenuImg = mainMenu2.querySelector("img");
    mainMenuImg.style.height = `${tileSize2 * 5}px`;
    mainMenuImg.style.top = `${marginTop + tileSize2 * 1}px`;
    mainMenuImg.style.left = `${marginLeft + canvasScreen3.width / 2 - tileSize2 * 2.5}px`;
    const startBtn = document.getElementById("startBtn");
    const startBtnImg = ASSETS["menuButtonStart"];
    startBtn.appendChild(startBtnImg);
    startBtn.style.height = `${tileSize2 * 2}px`;
    startBtn.style.width = `${tileSize2 * 6}px`;
    startBtn.style.fontSize = `${tileSize2 * 0.65}px`;
    startBtn.style.top = `${marginTop + tileSize2 * 7}px`;
    startBtn.style.left = `${marginLeft + canvasScreen3.width / 2 - tileSize2 * 3}px`;
    const startBtnAsGod = document.getElementById("startBtnAsGod");
    const startBtnAsGodImg = ASSETS["menuButtonStartAsGod"];
    startBtnAsGod.appendChild(startBtnAsGodImg);
    startBtnAsGod.style.height = `${tileSize2}px`;
    startBtnAsGod.style.width = `${tileSize2 * 6}px`;
    startBtnAsGod.style.fontSize = `${tileSize2 * 0.55}px`;
    startBtnAsGod.style.top = `${marginTop + tileSize2 * 9.5}px`;
    startBtnAsGod.style.left = `${marginLeft + canvasScreen3.width / 2 - tileSize2 * 3}px`;
    startBtnAsGod.style.padding = `${9.5 * pixelUnit2}px`;
    musicMuteElement(tileSize2, true);
    soundMuteElement(tileSize2, true);
    mainMenuCanvas.width = gameScreen2.width + sideScreen2.width;
    mainMenuCanvas.height = gameScreen2.height;
    mainMenuCanvas.style.top = `${marginTop}px`;
    mainMenuCanvas.style.left = `${marginLeft}px`;
    const beforeInit = document.getElementById("beforeInit");
    beforeInit.classList.add("disable");
  }
  function drawSideScreenBackground(ctx, screen, sideScreen2) {
    ctx.save();
    ctx.fillStyle = "rgba(50,50,50, 1)";
    ctx.fillRect(screen.width, 0, sideScreen2.width, sideScreen2.height);
    ctx.restore();
  }
  var stars = [];
  var mainMenuStars = [];
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
      xStar,
      yStar,
      starSize,
      brightness
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

  // core/loadAssets.js
  var SOUNDS = [
    "mainLoop",
    "addTileSound",
    "clic",
    "damage",
    "godDamage",
    "resourcePoping",
    "shoot",
    "thunderStrike",
    "bombSound"
  ];
  var IMAGES = [
    "bullet",
    "cardLevelUp",
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
    "sound",
    "soundMute",
    "music",
    "musicMute",
    "menuButtonStart",
    "menuButtonStartAsGod",
    "addTile",
    "statsBtn",
    "descriptionBtn",
    "cooldownIcon",
    "forceIcon",
    "rangeIcon",
    "speedIcon",
    "godTile"
  ];
  var ASSETS = [];
  var ASSETS_COUNT = SOUNDS.length + IMAGES.length;
  function loadAudio(url) {
    return new Promise((resolve) => {
      const audio = new Audio(url);
      audio.addEventListener("canplaythrough", () => resolve(audio), false);
    });
  }
  function loadImage(url) {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = url;
      image.addEventListener("load", () => resolve(image), false);
    });
  }
  async function loadAssets() {
    for (let i = 0; i < SOUNDS.length; i++) {
      let sound = SOUNDS[i];
      const ext = sound === "mainLoop" ? "mp3" : "wav";
      ASSETS[sound] = loadAudio(`./assets/src/sounds/${sound}.${ext}`);
    }
    for (let i = 0; i < IMAGES.length; i++) {
      let image = IMAGES[i];
      ASSETS[image] = loadImage(`./assets/src/images/${image}.png`);
    }
    for (const [name, asset] of Object.entries(ASSETS)) {
      ASSETS[name] = await asset;
    }
  }

  // player/projectile.js
  var Projectile = class {
    constructor(x, y, color, velocity, force, sprite) {
      this.x = x;
      this.y = y;
      this.radius = 6 * pixelUnit;
      this.color = color;
      this.velocity = velocity;
      this.speed = 1.2;
      this.force = force;
      this.sprite = sprite;
      this.spriteSize = tileSize;
    }
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.velocity.angle);
      ctx.translate(-this.x, -this.y);
      ctx.drawImage(
        this.sprite,
        this.x - tileSize / 2,
        this.y - tileSize / 2,
        this.spriteSize,
        this.spriteSize
      );
      ctx.restore();
    }
    update(ctx) {
      this.draw(ctx);
      this.x += this.velocity.x * pixelUnit * delta * this.speed * speedFactor;
      this.y += this.velocity.y * pixelUnit * delta * this.speed * speedFactor;
    }
  };

  // player/utils.js
  function drawLifeBar(ctx, entity) {
    let x = entity.x - tileSize / 2;
    let y = entity.y - tileSize / 2;
    if (entity.stats.hp < entity.maxHp) {
      let barRatio = entity.stats.hp / entity.maxHp;
      barRatio < 0 ? barRatio = 0 : barRatio;
      ctx.save();
      ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
      ctx.fillRect(
        x + tileSize * 0.4 / 2,
        y - tileSize * 0.1,
        tileSize * 0.6,
        tileSize * 0.1
      );
      ctx.fillStyle = "rgba(0, 175, 0, 0.9)";
      ctx.fillRect(
        x + tileSize * 0.4 / 2,
        y - tileSize * 0.1,
        tileSize * barRatio * 0.6,
        tileSize * 0.1
      );
      ctx.restore();
    }
  }
  var DrawDamage = class {
    constructor(entity, damage) {
      this.entity = entity;
      this.y = entity.y - tileSize / 2;
      this.yGap = 0;
      this.damage = damage;
      this.hue = 1;
    }
    draw(ctx) {
      ctx.save();
      let x = this.entity.x;
      x -= this.entity.radius / 2;
      ctx.font = `${tileSize / 3}px dogicapixel`;
      ctx.fillStyle = `hsla(1, 100%, 100%, ${this.hue})`;
      ctx.textAlign = "center";
      ctx.fillText(this.damage, x + tileSize / 2, this.y);
      this.yGap -= 0.5 * pixelUnit * delta;
      this.y = this.entity.y - tileSize / 2 + this.yGap;
      this.hue -= 0.05;
      ctx.restore();
    }
  };
  function hitMonsters(monster, damage) {
    monster.stats.hp -= damage;
    const damageText = new DrawDamage(monster, damage);
    damageTexts.push(damageText);
  }

  // player/player.js
  var Player = class {
    constructor(x, y, position, radius, image) {
      this.x = x;
      this.y = y;
      this.position = position;
      this.radius = radius;
      this.projectiles = [];
      this.projectileVelocity = {};
      this.maxHp = 30;
      this.stats = {
        hp: this.maxHp,
        exp: 0,
        force: 3,
        range: tileSize * 3.5,
        soulResource: 30
      };
      this.level = 0;
      this.lastAttack = 0;
      this.isAttacking = false;
      this.isTakingDamage = false;
      this.damageFrameCount = 0;
      this.img = new Image();
      this.img.src = image;
      this.spriteSize = 32;
      this.frameX = 0;
      this.frameY = 0;
      this.minFrame = 0;
      this.maxFrame = this.horizontalFrame * this.verticalFrame;
      this.frameRate = 40;
      this.lastFrame = 0;
      this.bullet = ASSETS["bullet"].cloneNode();
      this.localPauseDelta = 0;
      this.shootAudio = ASSETS["shoot"].cloneNode();
    }
    draw(ctx) {
      let timestamp = Date.now();
      this.updateHp();
      if (this.stats.soulResource < 0) {
        this.stats.soulResource = 0;
      }
      this.frameY = this.isTakingDamage ? 1 : 0;
      ctx.drawImage(
        this.img,
        this.frameX * this.spriteSize,
        this.frameY * this.spriteSize,
        this.spriteSize,
        this.spriteSize,
        this.x - this.radius / 2,
        this.y - this.radius / 2,
        this.radius,
        this.radius
      );
      if (!isPause) {
        if (this.isTakingDamage) {
          this.damageFrameCount++;
        }
        if (this.damageFrameCount === 10) {
          this.isTakingDamage = false;
          this.damageFrameCount = 0;
        }
        this.isAttacking ? this.shootAnimation(timestamp) : null;
        ctx.beginPath();
        ctx.lineWidth = 1 * pixelUnit;
        ctx.arc(
          this.x,
          this.y,
          this.stats.range + BONUS.GOD_RANGE,
          0,
          Math.PI * 2,
          false
        );
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        ctx.stroke();
        this.autoFire(timestamp, monsters);
        if (this.stats.exp >= this.stats.nextLvl) {
          this.stats.exp = 0;
          this.stats.nextLvl = Math.round(this.stats.nextLvl * 150) / 100;
        }
      }
      this.drawPlayerLife(ctx);
      this.drawLevel();
      this.drawsoulResource();
      this.drawHpLvl();
    }
    autoFire(timestamp, monsters2) {
      if (pauseDelta > 0) {
        this.localPauseDelta = pauseDelta;
      }
      monsters2.forEach((monster, index) => {
        monster.distance = Math.hypot(this.x - monster.x, this.y - monster.y);
        if (monster.distance < this.stats.range + BONUS.GOD_RANGE - monster.hitBox && calculateInterval(
          timestamp,
          this.lastAttack,
          1e3 - BONUS.GOD_COOLDOWN,
          this.localPauseDelta
        )) {
          const angle = Math.atan2(monster.y - this.y, monster.x - this.x);
          this.projectileVelocity = {
            x: Math.cos(angle) * 5,
            y: Math.sin(angle) * 5,
            angle
          };
          this.isAttacking = true;
          this.lastAttack = timestamp;
          this.localPauseDelta = 0;
        }
      });
    }
    shoot() {
      !soundMute ? this.shootAudio.play() : null;
      this.projectiles.push(
        new Projectile(
          this.x,
          this.y,
          "white",
          this.projectileVelocity,
          this.stats.force + BONUS.GOD_FORCE,
          this.bullet
        )
      );
    }
    takingDamage(damage) {
      this.stats.hp -= damage;
      this.isTakingDamage = true;
      const damageText = new DrawDamage(this, damage);
      damageTexts.push(damageText);
      playSound("godDamage");
    }
    shootAnimation(timestamp) {
      const horizontalFrame = this.img.naturalWidth / 32;
      if (calculateInterval(timestamp, this.lastFrame, 1e3 / this.frameRate)) {
        if (this.frameX < horizontalFrame - 1) {
          this.frameX += 1;
        } else {
          this.frameX = 0;
          this.shoot();
          this.isAttacking = false;
        }
        this.lastFrame = timestamp;
      }
    }
    drawPlayerLife(ctx) {
      const barRatio = this.stats.hp / this.maxHp;
      const barWidth = tileSize * 9.5;
      const barHeight = tileSize / 3;
      let barX = gameScreen.width + (sideScreen.width - barWidth) / 2;
      let barY = tileSize / 2;
      ctx.save();
      ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
      ctx.fillRect(barX, barY, barWidth, barHeight);
      ctx.fillStyle = "rgba(0, 175, 0, 0.9)";
      ctx.fillRect(barX, barY, barWidth * barRatio, barHeight);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 1 * pixelUnit;
      ctx.strokeRect(
        barX,
        barY - 1 * pixelUnit,
        barWidth,
        barHeight + 2 * pixelUnit
      );
      ctx.restore();
    }
    drawsoulResource() {
      const soulResource = document.getElementById("soulResource");
      soulResource.innerHTML = `${this.stats.soulResource}`;
      soulResource.style.left = `${marginLeft + gameScreen.width + tileSize / 2}px`;
      soulResource.style.top = `${marginTop + tileSize * 1.3}px`;
      soulResource.style.fontSize = `${tileSize / 2}px`;
    }
    drawLevel() {
      const levelText = document.getElementById("levelText");
      levelText.innerHTML = `LVL: ${this.level}`;
      levelText.style.left = `${marginLeft + gameScreen.width + tileSize / 2}px`;
      levelText.style.top = `${marginTop + tileSize * 2}px`;
      levelText.style.fontSize = `${tileSize / 2}px`;
    }
    drawHpLvl() {
      const hpLvl = document.getElementById("hpLvl");
      hpLvl.innerHTML = `${this.stats.hp}/${this.maxHp}`;
      hpLvl.style.width = `${tileSize * 9.5}px`;
      hpLvl.style.height = `${tileSize / 3}px`;
      hpLvl.style.left = `${gameScreen.width + (sideScreen.width - tileSize * 9.5) / 2}px`;
      hpLvl.style.top = `${marginTop + tileSize / 2 + 1 * pixelUnit}px`;
      hpLvl.style.fontSize = `${9 * pixelUnit}px`;
    }
    updateHp(isClicked = false) {
      if (isClicked) {
        setTimeout(() => {
          this.maxHp = 30 + tileMap.mountains.length * 5;
        }, 100);
      }
      if (this.stats.hp > this.maxHp) {
        this.stats.hp = this.maxHp;
      }
      if (this.stats.hp < 0) {
        this.stats.hp = 0;
      }
    }
  };

  // level/element/mountain.js
  var Mountain = class {
    constructor(x, y, image) {
      this.x = x * tileSize;
      this.y = y * tileSize;
      this.image = image;
      this.position = { x, y };
    }
  };

  // level/element/temple.js
  var Temple = class {
    constructor(x, y, image) {
      this.x = x * tileSize;
      this.y = y * tileSize;
      this.image = image;
      this.position = { x, y };
      this.maxHp = 5;
      this.stats = {
        hp: this.maxHp,
        manaLoad: 0,
        maxMana: 100,
        manaBonus: 5
      };
      this.isAttack = false;
      this.lastUpdate = 0;
      this.ismanaGenerated = false;
      this.manasToFeed = [];
      this.resourcePopingAudio = ASSETS["resourcePoping"];
    }
    update(ctx) {
      let timestamp = Date.now();
      this.drawLoadingCircle(ctx, timestamp);
      if (calculateInterval(timestamp, this.lastUpdate, 50)) {
        this.stats.manaLoad++;
        this.lastUpdate = timestamp;
      }
      if (this.stats.manaLoad > this.stats.maxMana) {
        this.stats.manaLoad = 0;
      }
    }
    drawLoadingCircle(ctx, timestamp) {
      let x = this.x + tileSize / 2;
      let y = this.y;
      const barRatio = this.stats.manaLoad / this.stats.maxMana;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.translate(x, y);
      ctx.rotate(Math.PI * 1.5);
      ctx.translate(-x, -y);
      ctx.arc(x, y, 5 * pixelUnit, 0, Math.PI * 2 * barRatio);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.restore();
      if (barRatio >= 1 && !this.ismanaGenerated) {
        this.ismanaGenerated = true;
        const localResourcePopingAudio = this.resourcePopingAudio.cloneNode();
        localResourcePopingAudio.volume = 0.5;
        !soundMute ? localResourcePopingAudio.play() : null;
        const mana = new ManaToFeed(x, y);
        this.manasToFeed.push(mana);
      }
      for (let i = 0; i < this.manasToFeed.length; i++) {
        this.manasToFeed[i].update(ctx);
        if (this.manasToFeed[i].x >= this.manasToFeed[i].targetX) {
          this.manasToFeed.splice(i, 1);
          tileMap.players[0].stats.soulResource += this.stats.manaBonus;
          this.ismanaGenerated = false;
        }
      }
    }
  };
  var ManaToFeed = class {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.targetX = gameScreen.width;
      this.targetY = tileSize * 1.75;
      this.velocity;
      this.speed = 3;
    }
    update(ctx) {
      this.draw(ctx);
      const angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
      this.velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5
      };
      this.x += this.velocity.x * pixelUnit * delta * this.speed;
      this.y += this.velocity.y * pixelUnit * delta * this.speed;
    }
    draw(ctx) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, 5 * pixelUnit, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.restore();
    }
  };

  // level/element/tower.js
  var Tower = class {
    constructor(x, y, image) {
      this.x = x * tileSize;
      this.y = y * tileSize;
      this.image = image;
      this.position = { x, y };
      this.maxHp = 5;
      this.stats = {
        hp: this.maxHp,
        loadSpeed: 10,
        force: 3,
        range: tileSize * 2.5
      };
      this.projectiles = [];
      this.lastAttack = 0;
      this.localPauseDelta = 0;
      this.bullet = ASSETS["bullet"].cloneNode();
      this.shootAudio = ASSETS["shoot"].cloneNode();
    }
    update(ctx) {
      let timestamp = Date.now();
      ctx.beginPath();
      ctx.lineWidth = 1 * pixelUnit;
      ctx.arc(
        this.x + tileSize / 2,
        this.y + tileSize / 2,
        this.stats.range + BONUS.TOWER_RANGE,
        0,
        Math.PI * 2,
        false
      );
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.stroke();
      this.autoFire(timestamp, monsters);
    }
    autoFire(timestamp, monsters2) {
      if (pauseDelta > 0) {
        this.localPauseDelta = pauseDelta;
      }
      monsters2.forEach((monster, index) => {
        monster.distance = Math.hypot(
          this.x + tileSize / 2 - monster.x,
          this.y + tileSize / 2 - monster.y
        );
        if (monster.distance < this.stats.range + BONUS.TOWER_RANGE - monster.hitBox && calculateInterval(
          timestamp,
          this.lastAttack,
          1e3 - BONUS.TOWER_COOLDOWN,
          this.localPauseDelta
        )) {
          const angle = Math.atan2(
            monster.y - this.y - tileSize / 2,
            monster.x - this.x - tileSize / 2
          );
          const velocity = {
            x: Math.cos(angle) * 5,
            y: Math.sin(angle) * 5,
            angle
          };
          if (this.projectiles.length < 1) {
            !soundMute ? this.shootAudio.play() : null;
            this.projectiles.push(
              new Projectile(
                this.x + tileSize / 2,
                this.y + tileSize / 2,
                "white",
                velocity,
                this.stats.force + BONUS.TOWER_FORCE,
                this.bullet
              )
            );
          }
          this.lastAttack = timestamp;
          this.localPauseDelta = 0;
        }
      });
    }
  };

  // level/spawningSpawnPoints.js
  var SpawnPoint = class {
    constructor(x, y) {
      this.x = x * tileSize;
      this.y = y * tileSize;
      this.position = { x, y };
      this.lastGroundSpawn = 0;
      this.level = 1;
      this.monstersCount = 0;
      this.MaxmonstersCount = 1;
      this.img = new Image();
      this.img.src = "./assets/src/images/spawnPoints.png";
      this.spriteSize = 32;
      this.frameX = 0;
      this.frameY = 0;
      this.minFrame = 0;
      this.maxFrame = this.horizontalFrame * this.verticalFrame;
      this.frameRate = 10;
      this.lastFrame = 0;
      this.isSpawning = false;
    }
    update(ctx) {
      let timestamp = Date.now();
      const horizontalFrame = this.img.naturalWidth / 32;
      ctx.save();
      ctx.drawImage(
        this.img,
        this.frameX * this.spriteSize,
        this.frameY * this.spriteSize,
        this.spriteSize,
        this.spriteSize,
        this.x,
        this.y,
        tileSize,
        tileSize
      );
      this.isSpawning && !isPause ? this.drawSpawnAnimation(timestamp) : null;
      ctx.restore();
    }
    drawSpawnAnimation(timestamp) {
      const horizontalFrame = this.img.naturalWidth / 32;
      if (calculateInterval(timestamp, this.lastFrame, 1e3 / this.frameRate)) {
        if (this.frameX < horizontalFrame - 1) {
          this.frameX += 1;
        } else {
          this.frameX = 0;
          this.isSpawning = false;
        }
        this.lastFrame = timestamp;
      }
    }
  };

  // player/visualEffects.js
  var Particle = class {
    constructor(x, y, radius, velocity, color, isStar) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.velocity = velocity;
      this.speed = 3;
      this.isStar = isStar ?? false;
      this.decreaseSpeed = isStar ? 0.03 : 0.05;
    }
    draw(ctx) {
      this.color = "white";
      ctx.save();
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.radius, this.radius);
      ctx.restore();
    }
    update(ctx) {
      this.draw(ctx);
      this.x += this.velocity.x * pixelUnit * this.speed * delta;
      this.y += this.velocity.y * pixelUnit * this.speed * delta;
      this.radius -= this.decreaseSpeed * pixelUnit * delta;
    }
  };

  // level/element/star.js
  var Star = class {
    constructor(x, y, image) {
      this.x = x * tileSize;
      this.y = y * tileSize;
      this.position = { x, y };
      this.position = { x, y };
      this.type = "star";
      this.stats = {
        range: tileSize * 2.5
      };
      this.starImage = image;
      this.particlesArray = [];
    }
    update(ctx) {
      ctx.beginPath();
      ctx.lineWidth = 1 * pixelUnit;
      ctx.arc(
        this.x + tileSize / 2,
        this.y + tileSize / 2,
        this.stats.range + BONUS.STAR_RANGE,
        0,
        Math.PI * 2,
        false
      );
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.stroke();
      this.createParticles(ctx);
      for (let i = 0; i < this.particlesArray.length; i++) {
        const particle = this.particlesArray[i];
        particle.update(ctx);
        const distance = Math.hypot(
          this.x + tileSize / 2 - particle.x,
          this.y + tileSize / 2 - particle.y
        );
        if (distance <= 5 * pixelUnit) {
          this.particlesArray.splice(i, 1);
        }
      }
    }
    createParticles(ctx) {
      let numberOfParticles = 10;
      const starCenter = { x: this.x + tileSize / 2, y: this.y + tileSize / 2 };
      while (this.particlesArray.length < numberOfParticles) {
        let size = Math.random() * 3 * pixelUnit;
        let angle = Math.random() * Math.PI * 2;
        let x = Math.cos(angle) * Math.random() * (this.stats.range + BONUS.STAR_RANGE) + starCenter.x;
        let y = Math.sin(angle) * Math.random() * (this.stats.range + BONUS.STAR_RANGE) + starCenter.y;
        let speed = 300;
        let directionX = -(x - starCenter.x) / speed;
        let directionY = -(y - starCenter.y) / speed;
        const velocity = { x: directionX, y: directionY };
        this.particlesArray.push(
          new Particle(x, y, size, velocity, "white", true)
        );
      }
    }
  };

  // level/element/tree.js
  var Tree = class {
    constructor(x, y, image) {
      this.x = x * tileSize;
      this.y = y * tileSize;
      this.image = image;
      this.position = { x, y };
      this.stats = {
        healthLoad: 0,
        maxHealth: 100,
        loadSpeed: 20,
        healthBonus: 1
      };
      this.isAttack = false;
      this.lastUpdate = 0;
      this.healthsToFeed = [];
      this.crossHealth = new Image();
      this.crossHealth.src = "./assets/src/images/healthCross.png";
    }
    update(ctx) {
      let timestamp = Date.now();
      this.drawLoadingHealth(ctx);
      if (calculateInterval(timestamp, this.lastUpdate, 1e3 / this.stats.loadSpeed)) {
        this.stats.healthLoad++;
        this.lastUpdate = timestamp;
      }
      if (this.stats.healthLoad > this.stats.maxHealth) {
        this.stats.healthLoad = 0;
        if (tileMap.players[0].stats.hp < tileMap.players[0].maxHp) {
          tileMap.players[0].stats.hp += this.stats.healthBonus;
        }
        const health = new HealthToFeed(this.x, this.y);
        this.healthsToFeed.push(health);
      }
      for (let i = 0; i < this.healthsToFeed.length; i++) {
        this.healthsToFeed[i].update(ctx);
        if (this.healthsToFeed[i].x >= this.healthsToFeed[i].targetX) {
          this.healthsToFeed.splice(i, 1);
          tileMap.players[0].stats.healthResource += this.stats.healthBonus;
          this.ishealthGenerated = false;
        }
      }
    }
    drawLoadingHealth(ctx) {
      const crossXPos = this.x + tileSize / 4;
      const crossYPos = this.y - tileSize / 4;
      const spriteSize = 16;
      const ratio = this.stats.healthLoad / this.stats.maxHealth;
      ctx.drawImage(
        this.crossHealth,
        0,
        spriteSize * ratio - spriteSize,
        spriteSize,
        spriteSize,
        crossXPos,
        crossYPos,
        tileSize / 2,
        tileSize / 2
      );
    }
  };
  var HealthToFeed = class {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.targetX = gameScreen.width;
      this.targetY = tileSize;
      this.velocity;
      this.speed = 3;
      this.crossHealth = new Image();
      this.crossHealth.src = "./assets/src/images/healthCross.png";
    }
    update(ctx) {
      this.draw(ctx);
      const angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
      this.velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5
      };
      this.x += this.velocity.x * pixelUnit * delta * this.speed;
      this.y += this.velocity.y * pixelUnit * delta * this.speed;
    }
    draw(ctx) {
      ctx.drawImage(this.crossHealth, this.x, this.y, tileSize / 2, tileSize / 2);
    }
  };

  // level/element/river.js
  var River = class {
    constructor(x, y, image) {
      this.x = x * tileSize;
      this.y = y * tileSize;
      this.position = { x, y };
      this.position = { x, y };
      this.type = "river";
      this.stats = {
        range: tileSize * 2.5
      };
      this.img = image;
      this.spriteSize = 32;
      this.frameX = 0;
      this.frameY = 0;
      this.minFrame = 0;
      this.maxFrame = this.horizontalFrame * this.verticalFrame;
      this.frameRate = 1;
      this.lastFrame = 0;
    }
    update(ctx) {
      let timestamp = Date.now();
      const horizontalFrame = this.img.naturalWidth / 32;
      ctx.save();
      ctx.drawImage(
        this.img,
        this.frameX * this.spriteSize,
        this.frameY * this.spriteSize,
        this.spriteSize,
        this.spriteSize,
        this.x - tileSize / 2,
        this.y - tileSize / 2,
        tileSize,
        tileSize
      );
      if (calculateInterval(timestamp, this.lastFrame, 3e3)) {
        this.frameX = this.frameX < horizontalFrame - 1 ? this.frameX + 1 : 0;
        this.lastFrame = timestamp;
      }
      ctx.restore();
    }
  };

  // level/tileMap.js
  var TileMap = class {
    constructor() {
      this.tileSize = 0;
      this.mapOrigin = { x: 0, y: 0 };
      this.players = [];
      this.greenTile = new Image();
      this.greenTile.src = "./assets/src/images/greenTile.png";
      this.greenTileFull = new Image();
      this.greenTileFull.src = "./assets/src/images/greenTileFull.png";
      this.mountain = new Image();
      this.mountain.src = "./assets/src/images/mountain.png";
      this.mountains = [];
      this.temple = new Image();
      this.temple.src = "./assets/src/images/temple.png";
      this.temples = [];
      this.tree = new Image();
      this.tree.src = "./assets/src/images/tree.png";
      this.trees = [];
      this.tower = new Image();
      this.tower.src = "./assets/src/images/tower.png";
      this.towers = [];
      this.lava = new Image();
      this.lava.src = "./assets/src/images/lava.png";
      this.lavas = [];
      this.river = new Image();
      this.river.src = "./assets/src/images/riverAnimation.png";
      this.rivers = [];
      this.desert = new Image();
      this.desert.src = "./assets/src/images/desert.png";
      this.deserts = [];
      this.star = new Image();
      this.star.src = "./assets/src/images/star.png";
      this.stars = [];
      this.elements = [];
      this.spawnPoints = [];
      this.map = map;
    }
    draw(ctx) {
      for (let row = 0; row < mapSizeY; row++) {
        for (let column = 0; column < mapSizeX; column++) {
          let tile = this.map[row][column];
          if (tile === "bomb") {
            this.map[row][column] = "0";
          }
          if (tile === "player") {
            if (!this.players.some(
              (player) => player.position.x === column && player.position.y === row
            )) {
              let player = new Player(
                this.tileSize * column + this.tileSize / 2,
                this.tileSize * row + this.tileSize / 2,
                { x: column, y: row },
                this.tileSize,
                "./assets/src/images/god.png"
              );
              this.players.push(player);
            }
          }
          if (tile === "mountain") {
            ctx.drawImage(
              this.mountain,
              column * this.tileSize,
              row * this.tileSize,
              this.tileSize,
              this.tileSize
            );
            if (selectedBtn && selectedBtn.type === "bomb") {
              ctx.drawImage(
                this.greenTileFull,
                column * this.tileSize,
                row * this.tileSize,
                this.tileSize,
                this.tileSize
              );
            }
            if (!this.mountains.some(
              (mountain) => mountain.position.x === column && mountain.position.y === row
            )) {
              let mountain = new Mountain(column, row);
              this.mountains.push(mountain);
            }
          }
          if (tile === "temple") {
            ctx.drawImage(
              this.temple,
              column * this.tileSize,
              row * this.tileSize,
              this.tileSize,
              this.tileSize
            );
            if (selectedBtn && selectedBtn.type === "bomb") {
              ctx.drawImage(
                this.greenTileFull,
                column * this.tileSize,
                row * this.tileSize,
                this.tileSize,
                this.tileSize
              );
            }
            if (!this.temples.some(
              (temple) => temple.position.x === column && temple.position.y === row
            )) {
              let temple = new Temple(column, row);
              this.temples.push(temple);
            }
          }
          if (tile === "tree") {
            ctx.drawImage(
              this.tree,
              column * this.tileSize,
              row * this.tileSize,
              this.tileSize,
              this.tileSize
            );
            if (selectedBtn && selectedBtn.type === "bomb") {
              ctx.drawImage(
                this.greenTileFull,
                column * this.tileSize,
                row * this.tileSize,
                this.tileSize,
                this.tileSize
              );
            }
            if (!this.trees.some(
              (tree) => tree.position.x === column && tree.position.y === row
            )) {
              let tree = new Tree(column, row);
              this.trees.push(tree);
            }
          }
          if (tile === "tower") {
            ctx.drawImage(
              this.tower,
              column * this.tileSize,
              row * this.tileSize,
              this.tileSize,
              this.tileSize
            );
            if (selectedBtn && selectedBtn.type === "bomb") {
              ctx.drawImage(
                this.greenTileFull,
                column * this.tileSize,
                row * this.tileSize,
                this.tileSize,
                this.tileSize
              );
            }
            if (!this.towers.some(
              (tower) => tower.position.x === column && tower.position.y === row
            )) {
              let tower = new Tower(column, row);
              this.towers.push(tower);
            }
          }
          if (tile === "lava") {
            ctx.drawImage(
              this.lava,
              column * this.tileSize,
              row * this.tileSize,
              this.tileSize,
              this.tileSize
            );
            if (selectedBtn && selectedBtn.type === "bomb") {
              ctx.drawImage(
                this.greenTileFull,
                column * this.tileSize,
                row * this.tileSize,
                this.tileSize,
                this.tileSize
              );
            }
            if (!this.lavas.some(
              (lava) => lava.column === column && lava.row === row
            )) {
              let lava = { column, row };
              this.lavas.push(lava);
            }
          }
          if (tile === "desert") {
            ctx.drawImage(
              this.desert,
              column * this.tileSize,
              row * this.tileSize,
              this.tileSize,
              this.tileSize
            );
            if (selectedBtn && selectedBtn.type === "bomb") {
              ctx.drawImage(
                this.greenTileFull,
                column * this.tileSize,
                row * this.tileSize,
                this.tileSize,
                this.tileSize
              );
            }
            if (!this.deserts.some(
              (desert) => desert.column === column && desert.row === row
            )) {
              let desert = { column, row };
              this.deserts.push(desert);
            }
          }
          if (tile === "river") {
            if (selectedBtn && selectedBtn.type === "bomb") {
              ctx.drawImage(
                this.greenTileFull,
                column * this.tileSize,
                row * this.tileSize,
                this.tileSize,
                this.tileSize
              );
            }
            if (!this.rivers.some(
              (river) => river.column === column && river.row === row
            )) {
              let river = new River(column, row, this.river);
              this.rivers.push(river);
            }
            if (selectedBtn && selectedBtn.type === "bomb") {
              ctx.drawImage(
                this.greenTileFull,
                column * this.tileSize,
                row * this.tileSize,
                this.tileSize,
                this.tileSize
              );
            }
          }
          if (tile === "star") {
            ctx.drawImage(
              this.star,
              this.tileSize * column,
              this.tileSize * row,
              this.tileSize,
              this.tileSize
            );
            if (selectedBtn && selectedBtn.type === "bomb") {
              ctx.drawImage(
                this.greenTileFull,
                column * this.tileSize,
                row * this.tileSize,
                this.tileSize,
                this.tileSize
              );
            }
            if (!this.stars.some(
              (star) => star.position.x === column && star.position.y === row
            )) {
              let star = new Star(column, row, this.star);
              this.stars.push(star);
            }
          }
          if (tile === "green") {
            ctx.drawImage(
              this.greenTile,
              this.tileSize * column,
              this.tileSize * row,
              this.tileSize,
              this.tileSize
            );
          }
          if (tile === "spawnPoints") {
            if (!this.spawnPoints.some(
              (spawnPoint) => spawnPoint.position.x === column && spawnPoint.position.y === row
            )) {
              let spawnPoint = new SpawnPoint(column, row);
              this.spawnPoints.push(spawnPoint);
            }
          }
        }
      }
      this.deletableElements = [
        this.mountains,
        this.temples,
        this.trees,
        this.towers,
        this.stars
      ];
      this.elements = [
        { type: "mountain", element: this.mountains },
        { type: "temple", element: this.temples },
        { type: "tree", element: this.trees },
        { type: "tower", element: this.towers },
        { type: "star", element: this.stars },
        { type: "river", element: this.rivers },
        { type: "desert", element: this.deserts },
        { type: "lava", element: this.lavas }
      ];
    }
    init() {
      this.players = [];
      this.mountains = [];
      this.temples = [];
      this.towers = [];
      this.trees = [];
      this.spawnPoints = [];
      this.stars = [];
      createMap();
      this.map = map;
    }
    getPosition(x, y) {
      if (x < 0) {
        x = 0;
      }
      if (y < 0) {
        y = 0;
      }
      let position = {};
      for (let row = 0; row < mapSizeX; row++) {
        for (let column = 0; column < mapSizeY; column++) {
          if (x >= row * this.tileSize && x < row * this.tileSize + this.tileSize) {
            if (y >= column * this.tileSize && y < column * this.tileSize + this.tileSize) {
              position.x = row;
              position.y = column;
            }
          }
        }
      }
      return position;
    }
    getNeighbors(position) {
      let neighbors = [];
      neighbors.push({
        position: { x: position.x, y: position.y - 1 },
        tileValue: position.y - 1 >= 0 ? map[position.y - 1][position.x] : "99"
      });
      neighbors.push({
        position: { x: position.x, y: position.y + 1 },
        tileValue: map[position.y + 1][position.x]
      });
      neighbors.push({
        position: { x: position.x - 1, y: position.y },
        tileValue: map[position.y][position.x - 1]
      });
      neighbors.push({
        position: { x: position.x + 1, y: position.y },
        tileValue: map[position.y][position.x + 1]
      });
      return neighbors;
    }
  };

  // level/element/bomb.js
  function bombMecanics(bombPos) {
    for (let i = 0; i < tileMap.deletableElements.length; i++) {
      deleteFromElementArray(tileMap.deletableElements[i], bombPos);
    }
  }
  function deleteFromElementArray(elementArray, bombPos) {
    for (let i = 0; i < elementArray.length; i++) {
      const element = elementArray[i];
      if (element.type === "star") {
        for (let i2 = 0; i2 < monsters.length; i2++) {
          let monster = monsters[i2];
          monster.findingPath();
        }
      }
      if (element.position.x === bombPos.x && element.position.y === bombPos.y) {
        elementArray.splice(i, 1);
        const bombSound = ASSETS["bombSound"].cloneNode();
        !soundMute ? bombSound.play() : null;
      }
    }
  }

  // player/NPCs/findPath.js
  var toKey = (x, y) => `${x}x${y}`;
  var findPath = (start, target, type) => {
    const queue = [];
    const parentForKey = {};
    const startKey = toKey(start.x, start.y);
    const targetKey = toKey(target.x, target.y);
    parentForKey[startKey] = {
      key: "",
      position: { x: -1, y: -1 }
    };
    queue.push(start);
    while (queue.length > 0) {
      const { x, y } = queue.shift();
      const currentKey2 = toKey(x, y);
      if (currentKey2 === targetKey) {
        break;
      }
      const neighbors = [
        { x, y: y - 1 },
        { x: x + 1, y },
        { x, y: y + 1 },
        { x: x - 1, y }
      ];
      for (let i = 0; i < neighbors.length; ++i) {
        const neighbor = neighbors[i];
        if (neighbor.x <= 0) {
          neighbor.x = 0;
        }
        if (neighbor.y <= 0) {
          neighbor.y = 0;
        }
        if (neighbor.x > mapSizeX - 1) {
          neighbor.x = mapSizeX - 2;
        }
        if (neighbor.y > mapSizeY - 1) {
          neighbor.y = mapSizeY - 2;
        }
        const tile = map[neighbor.y][neighbor.x];
        if (!tile) {
          continue;
        }
        if (type === "ground" && SOLID_ELEMENTS.includes(tile) && !FRANCHISSABLE_ELEMENTS.includes(tile)) {
          continue;
        }
        if (type === "air" && tile === "mountain") {
          continue;
        }
        const key = toKey(neighbor.x, neighbor.y);
        if (key in parentForKey) {
          continue;
        }
        parentForKey[key] = {
          key: currentKey2,
          position: { x, y }
        };
        queue.push(neighbor);
      }
    }
    const lastPos = {
      x: target.x * tileSize + tileSize / 2,
      y: target.y * tileSize + tileSize / 2
    };
    const path = [lastPos];
    let currentKey = targetKey;
    if (!parentForKey[targetKey]) {
      return;
    }
    parentForKey[targetKey].position = {
      x: target.x,
      y: target.y
    };
    let currentPos = parentForKey[targetKey].position;
    while (currentKey !== startKey) {
      const pos = { x: currentPos.x * tileSize, y: currentPos.y * tileSize };
      pos.x += tileSize * 0.5;
      pos.y += tileSize * 0.5;
      path.push(pos);
      const key = parentForKey[currentKey].key;
      const position = parentForKey[currentKey].position;
      currentKey = key;
      currentPos = position;
    }
    path.reverse();
    return path;
  };
  var findPath_default = findPath;

  // core/constants/monsters.js
  var MONSTERS_STATS = [
    {
      name: "worm",
      type: "ground",
      level: 1,
      hp: 6,
      force: 1,
      speed: 0.8
    },
    {
      name: "spider",
      type: "ground",
      level: 3,
      hp: 10,
      force: 2,
      speed: 1.2
    },
    {
      name: "fly",
      type: "air",
      level: 5,
      hp: 12,
      force: 4,
      speed: 1.5
    },
    {
      name: "slime",
      type: "ground",
      level: 7,
      hp: 50,
      force: 3,
      speed: 0.7
    },
    {
      name: "bat",
      type: "air",
      level: 7,
      hp: 23,
      force: 3,
      speed: 1.9
    },
    {
      name: "skull",
      type: "ground",
      level: 9,
      hp: 82,
      force: 10,
      speed: 0.8
    },
    {
      name: "ghost",
      type: "air",
      level: 12,
      hp: 100,
      force: 15,
      speed: 1.8
    },
    {
      name: "bombMonster",
      type: "bomb",
      level: 9999,
      hp: 150,
      force: 1,
      speed: 2.5
    }
  ];

  // player/NPCs/monster.js
  var Monster = class {
    constructor(x, y, radius, name, type) {
      this.x = x + tileSize / 2;
      this.y = y + tileSize / 2;
      this.radius = radius;
      this.name = name;
      this.type = type;
      this.velocity = { x: 0, y: 0 };
      this.stats = this.getMonsterStats();
      this.speed = this.stats.speed * 0.4;
      this.maxHp = this.stats.hp;
      this.visitedStars = [];
      this.isTakingDamage = false;
      this.damageFrameCount = 0;
      this.startVec = tileMap.getPosition(this.x, this.y);
      this.defaultTargetVec = tileMap.getPosition(
        tileMap.players[0].x,
        tileMap.players[0].y
      );
      this.targetVec = this.defaultTargetVec;
      this.isBombTarget = false;
      this.toDelete;
      this.ArrayToDelete;
      this.lastTargetVec = this.targetVec;
      this.path = findPath_default(this.startVec, this.targetVec, this.stats.type);
      this.lastLavaDamage = 0;
      this.lavaCooldown = 1e3;
      this.desertFactor = 0.5;
      this.distance = 0;
      this.position = tileMap.getPosition(this.x, this.y);
      this.moveToTarget = this.path ? this.path.shift() : null;
      this.hitBox = tileSize / 3;
      this.img = new Image();
      this.img.src = `./assets/src/images/${name}.png`;
      this.spriteSize = 32;
      this.frameX = 0;
      this.frameY = 0;
      this.minFrame = 0;
      this.maxFrame = this.horizontalFrame * this.verticalFrame;
      this.frameRate = 10;
      this.lastFrame = 0;
      this.localPauseDelta = 0;
      this.damageAudio = ASSETS["damage"].cloneNode();
    }
    getMonsterStats() {
      const stats = MONSTERS_STATS.find((monster) => {
        return monster.name === this.name;
      });
      const statsToReturn = { ...stats };
      return statsToReturn;
    }
    findingPath(forceUpdate = true) {
      if (!forceUpdate && this.lastTargetVec.x === this.targetVec.x && this.lastTargetVec.y === this.targetVec.y) {
        return;
      }
      this.startVec = tileMap.getPosition(this.x, this.y);
      if (this.startVec.x === this.targetVec.x && this.startVec.y === this.targetVec.y) {
        return;
      }
      this.path = findPath_default(this.startVec, this.targetVec, this.stats.type);
      this.moveToTarget = this.path ? this.path.shift() : null;
    }
    draw(ctx, timestamp) {
      const horizontalFrame = this.img.naturalWidth / 32;
      this.frameY = this.isTakingDamage ? 1 : 0;
      ctx.save();
      ctx.drawImage(
        this.img,
        this.frameX * this.spriteSize,
        this.frameY * this.spriteSize,
        this.spriteSize,
        this.spriteSize,
        this.x - this.radius / 2,
        this.y - this.radius / 2,
        this.radius,
        this.radius
      );
      if (!isPause) {
        if (calculateInterval(timestamp, this.lastFrame, 1e3 / this.frameRate)) {
          this.frameX = this.frameX < horizontalFrame - 1 ? this.frameX + 1 : 0;
          this.lastFrame = timestamp;
        }
      }
      ctx.restore();
    }
    moveAlong() {
      if (!this.path || this.path.length <= 0) {
        return;
      }
      this.moveTo(this.path.shift());
    }
    moveTo(target) {
      this.moveToTarget = target;
    }
    bombMonsterMecs() {
      if (!this.isBombTarget) {
        this.ArrayToDelete = tileMap.deletableElements[Math.floor(Math.random() * tileMap.deletableElements.length)];
        this.toDelete = this.ArrayToDelete[Math.floor(Math.random() * this.ArrayToDelete.length)];
        if (this.toDelete) {
          this.targetVec = tileMap.getPosition(this.toDelete.x, this.toDelete.y);
          this.isBombTarget = true;
          this.findingPath();
        } else {
          return;
        }
      }
      const minDistance = 2 * pixelUnit;
      let distance = Math.hypot(
        this.toDelete.x - this.x + tileSize / 2,
        this.toDelete.y - this.y + tileSize / 2
      );
      if (distance <= minDistance) {
        this.stats.hp = 0;
        deleteFromElementArray(this.ArrayToDelete, this.targetVec);
        tileMap.map[this.targetVec.y][this.targetVec.x] = "bomb";
      }
    }
    update(ctx) {
      let timestamp = Date.now();
      if (pauseDelta > 0) {
        this.localPauseDelta = pauseDelta;
      }
      this.name !== "bombMonster" ? this.starMecanics() : null;
      this.name === "bombMonster" ? this.bombMonsterMecs() : null;
      if (this.isTakingDamage) {
        this.damageFrameCount++;
      }
      if (this.damageFrameCount === 10) {
        this.isTakingDamage = false;
        this.damageFrameCount = 0;
      }
      this.position = tileMap.getPosition(this.x, this.y);
      let currentTile = tileMap.map[this.position.y][this.position.x];
      if (calculateInterval(
        timestamp,
        this.lastLavaDamage,
        this.lavaCooldown,
        this.localPauseDelta
      ) && currentTile === "lava") {
        !this.isTakingDamage ? this.takingDamage(3 + BONUS.LAVA_FORCE) : null;
        this.lastLavaDamage = timestamp;
        this.localPauseDelta = 0;
      }
      currentTile === "river" && this.type === "ground" ? this.stats.hp = 0 : null;
      this.draw(ctx, timestamp);
      let dx = 0;
      let dy = 0;
      if (this.moveToTarget) {
        dx = this.moveToTarget.x - this.x;
        dy = this.moveToTarget.y - this.y;
        if (Math.abs(dx) < 2 * pixelUnit) {
          dx = 0;
        }
        if (Math.abs(dy) < 2 * pixelUnit) {
          dy = 0;
        }
        const angle = Math.atan2(dy, dx);
        this.velocity = {
          x: dx === 0 ? 0 : Math.cos(angle),
          y: dy === 0 ? 0 : Math.sin(angle)
        };
        let slowDownFactor = currentTile === "desert" ? this.desertFactor : 1;
        this.x += this.velocity.x * pixelUnit * delta * this.speed * slowDownFactor * speedFactor;
        this.y += this.velocity.y * pixelUnit * delta * this.speed * slowDownFactor * speedFactor;
        if (dx === 0 && dy === 0) {
          if (this.path && this.path.length > 0) {
            this.moveTo(this.path.shift());
            return;
          }
          this.moveToTarget = void 0;
        }
      }
      this.lastTargetVec = this.targetVec;
    }
    takingDamage(damage) {
      this.stats.hp -= damage;
      this.isTakingDamage = true;
      const damageText = new DrawDamage(this, damage);
      damageTexts.push(damageText);
      !soundMute ? this.damageAudio.play() : null;
    }
    starMecanics() {
      const minDistance = 5 * pixelUnit;
      for (let i = 0; i < tileMap.stars.length; i++) {
        let star = tileMap.stars[i];
        let distance = Math.hypot(
          star.x - this.x + tileSize / 2,
          star.y - this.y + tileSize / 2
        );
        if (distance - star.stats.range - BONUS.STAR_RANGE <= 0 && distance > minDistance && !this.visitedStars.some(
          (visitedStar) => visitedStar.x === star.x && visitedStar.y === star.y
        )) {
          this.targetVec = star.position;
          this.findingPath(false);
          this.visitedStars.push(star);
        }
        if (distance <= minDistance) {
          this.targetVec = this.defaultTargetVec;
          this.findingPath(false);
        }
      }
      if (!tileMap.stars.some(
        (star) => star.position.x === this.targetVec.x && star.position.y === this.targetVec.y
      )) {
        this.targetVec = this.defaultTargetVec;
        this.findingPath(false);
      }
    }
  };

  // player/NPCs/spawn.js
  var playerPos = {
    x: Math.floor(mapSizeX / 2),
    y: Math.floor(mapSizeY / 2)
  };
  var spawnGroundRate = 0.2;
  var localPauseDelta = 0;
  function monsterSelection() {
    const array = MONSTERS_STATS.filter((monster) => {
      return monster.level <= tileMap.players[0].level;
    });
    return array;
  }
  function spawnMonsters() {
    const timestamp = Date.now();
    let highestLevelSpawn;
    if (tileMap.spawnPoints.length > 0) {
      highestLevelSpawn = tileMap.spawnPoints.reduce(
        (max, spawnPoint) => max.MaxmonstersCount > spawnPoint.MaxmonstersCount ? max : spawnPoint
      );
    }
    if (pauseDelta > 0) {
      localPauseDelta = pauseDelta;
    }
    for (let i = 0; i < tileMap.spawnPoints.length; i++) {
      const spawnPoint = tileMap.spawnPoints[i];
      if (highestLevelSpawn && highestLevelSpawn.monstersCount === highestLevelSpawn.MaxmonstersCount) {
        if (monsters.length === 0 && particles.length === 0) {
          inverseLeveUp();
          tileMap.spawnPoints.forEach((spawnPoint2) => {
            spawnPoint2.monstersCount = 0;
            spawnPoint2.MaxmonstersCount++;
          });
        }
        return;
      }
      if (!isPause && calculateInterval(
        timestamp,
        spawnPoint.lastGroundSpawn,
        1e3 / spawnGroundRate,
        localPauseDelta
      )) {
        const monsterSelectionArray = monsterSelection();
        const monsterSelected = monsterSelectionArray[Math.floor(Math.random() * monsterSelectionArray.length)];
        const groundSpawnPosition = getGroundSpawnPosition(spawnPoint);
        spawnPoint.isSpawning = true;
        setTimeout(() => {
          monsters.push(
            new Monster(
              groundSpawnPosition.x,
              groundSpawnPosition.y,
              tileSize,
              monsterSelected.name,
              monsterSelected.type
            )
          );
          spawnPoint.monstersCount++;
        }, 200);
        spawnPoint.lastGroundSpawn = timestamp;
        localPauseDelta = 0;
      }
    }
    return;
  }
  function getGroundSpawnPosition(spawnPoint) {
    const position = { x: spawnPoint.x, y: spawnPoint.y };
    return position;
  }
  function generateSpawn() {
    let x, y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 : mapSizeX - 1;
      y = Math.floor(Math.random() * mapSizeY);
    } else {
      x = Math.floor(Math.random() * mapSizeX);
      y = Math.random() < 0.5 ? 0 : mapSizeY - 1;
    }
    while (tileMap.spawnPoints.some(
      (spawnPoint) => spawnPoint.position.x === x && spawnPoint.position.y === y
    )) {
      if (Math.random() < 0.5) {
        x = Math.random() < 0.5 ? 0 : mapSizeX - 1;
        y = Math.floor(Math.random() * mapSizeY);
      } else {
        x = Math.floor(Math.random() * mapSizeX);
        y = Math.random() < 0.5 ? 0 : mapSizeY - 1;
      }
    }
    tileMap.map[y][x] = "spawnPoints";
    tileMap.players[0].stats.soulResource += 10;
  }

  // core/levelUp/cardForLevelUp.js
  var CARD_FOR_LEVEL_UP = [
    class PlaceSpawnPoint {
      id = "PlaceSpawnPoint";
      tile = "spawnTile";
      bonus = "bonusBlank";
      isBonus = true;
      description = "Place an spawn point anywhere in the screen border.</br>Gain 3 soul resources.";
      function = () => {
        updateSelectedBtn({ type: "spawnPoints", value: 0 });
        possibilityForClick();
        tileMap.draw(ctxScreen);
        tileMap.players[0].draw(ctxScreen);
        inversePause();
        tileMap.players[0].stats.soulResource += 3;
      };
    },
    class GainResources {
      id = "GainResources";
      tile = "tileBlank";
      bonus = "bonusUp";
      isBonus = true;
      description = "Gain 100 soul resources.</br>Lose 10 PV.";
      function = () => {
        tileMap.players[0].stats.soulResource += 100;
        tileMap.players[0].stats.hp -= 10;
      };
    },
    class GainLife {
      id = "GainLife";
      tile = "healthCross";
      bonus = "bonusUp";
      isBonus = true;
      description = "Gain 10 HP.</br>Lose 100 soul resources .";
      function = () => {
        tileMap.players[0].stats.soulResource -= 100;
        tileMap.players[0].stats.hp += 10;
      };
    },
    class TowerForceUpgrade {
      id = "TowerForceUpgrade";
      tile = "tower";
      bonus = "forceUp";
      isBonus = true;
      description = "All towers gain + 1 attack.";
      function = () => {
        BONUS.TOWER_FORCE += 1;
      };
    },
    class TowerForceDowngrade {
      id = "TowerForceDowngrade";
      tile = "tower";
      bonus = "forceDown";
      isBonus = false;
      description = "All towers lose 1 attack.</br>Minimum force bonus : -2";
      function = () => {
        BONUS.TOWER_FORCE -= 1;
        BONUS.TOWER_FORCE < -2 ? BONUS.TOWER_FORCE = -2 : null;
      };
    },
    class GodForceUpgrade {
      id = "GodForceUpgrade";
      tile = "godTile";
      bonus = "forceUp";
      isBonus = true;
      description = "God gains + 1 attack.";
      function = () => {
        BONUS.GOD_FORCE += 1;
      };
    },
    class GodForceDowngrade {
      id = "GodForceDowngrade";
      tile = "godTile";
      bonus = "forceDown";
      isBonus = false;
      description = "God lose 1 attack.</br>Minimum force bonus : -2";
      function = () => {
        BONUS.GOD_FORCE -= 1;
        BONUS.GOD_FORCE < -2 ? BONUS.GOD_FORCE = -2 : null;
      };
    },
    class LavaForceUpgrade {
      id = "LavaForceUpgrade";
      tile = "lava";
      bonus = "forceUp";
      isBonus = true;
      description = `Lava gains + 1 attack.`;
      function = () => {
        BONUS.LAVA_FORCE += 1;
      };
    },
    class LavaForceDowngrade {
      id = "LavaForceDowngrade";
      tile = "lava";
      bonus = "forceDown";
      isBonus = false;
      description = "Lava lose 1 attack.</br>Minimum force bonus : -2";
      function = () => {
        BONUS.LAVA_FORCE -= 1;
        BONUS.LAVA_FORCE < -2 ? BONUS.LAVA_FORCE = -2 : null;
      };
    },
    class TowerCooldownUpgrade {
      id = "TowerCooldownUpgrade";
      tile = "tower";
      bonus = "cooldownUp";
      isBonus = true;
      description = `Towers shoot cooldown is decreased of 0.1 sec.`;
      function = () => {
        BONUS.TOWER_COOLDOWN -= 100;
        BONUS.TOWER_COOLDOWN < -700 ? BONUS.TOWER_COOLDOWN = -700 : null;
      };
    },
    class TowerCooldownDowngrade {
      id = "TowerCooldownDowngrade";
      tile = "tower";
      bonus = "cooldownDown";
      isBonus = false;
      description = `Towers shoot cooldown is increased of 0.1 sec.`;
      function = () => {
        BONUS.TOWER_COOLDOWN < 700 ? BONUS.TOWER_COOLDOWN += 100 : null;
      };
    },
    class GodCooldownUpgrade {
      id = "GodCooldownUpgrade";
      tile = "godTile";
      bonus = "cooldownUp";
      isBonus = true;
      description = `God shoot cooldown is decreased of 0.1 sec.`;
      function = () => {
        BONUS.GOD_COOLDOWN -= 100;
        BONUS.GOD_COOLDOWN < -700 ? BONUS.TOWER_COOLDOWN = -700 : null;
      };
    },
    class GodCooldownDowngrade {
      id = "GodCooldownDowngrade";
      tile = "godTile";
      bonus = "cooldownDown";
      isBonus = false;
      description = `God shoot cooldown is increased of 0.1 sec.`;
      function = () => {
        BONUS.GOD_COOLDOWN < 700 ? BONUS.GOD_COOLDOWN += 100 : null;
      };
    },
    class GodRangeDowngrade {
      id = "GodRangeDowngrade";
      tile = "godTile";
      bonus = "rangeDown";
      isBonus = false;
      description = `God range is shortened.`;
      function = () => {
        BONUS.GOD_RANGE -= 0.5 * tileSize;
        BONUS.GOD_RANGE < -2 * tileSize ? BONUS.GOD_RANGE = -2 * tileSize : null;
      };
    },
    class GodRangeUpgrade {
      id = "GodRangeUpgrade";
      tile = "godTile";
      bonus = "rangeUp";
      isBonus = true;
      description = `God range is expended.`;
      function = () => {
        BONUS.GOD_RANGE += 0.5 * tileSize;
        BONUS.GOD_RANGE > 2 * tileSize ? BONUS.GOD_RANGE = 2 * tileSize : null;
      };
    },
    class TowerRangeDowngrade {
      id = "TowerRangeDowngrade";
      tile = "tower";
      bonus = "rangeDown";
      isBonus = false;
      description = `Tower range is shortened.`;
      function = () => {
        BONUS.TOWER_RANGE -= 0.5 * tileSize;
        BONUS.TOWER_RANGE < -2 * tileSize ? BONUS.TOWER_RANGE = -2 * tileSize : null;
      };
    },
    class TowerRangeUpgrade {
      id = "TowerRangeUpgrade";
      tile = "tower";
      bonus = "rangeUp";
      isBonus = true;
      description = `Tower range is expended.`;
      function = () => {
        BONUS.TOWER_RANGE += 0.5 * tileSize;
        BONUS.TOWER_RANGE > 2 * tileSize ? BONUS.TOWER_RANGE = 2 * tileSize : null;
      };
    },
    class StarRangeUpgrade {
      id = "StarRangeUpgrade";
      tile = "star";
      bonus = "rangeUp";
      isBonus = true;
      description = `Star range is expended.`;
      function = () => {
        BONUS.STAR_RANGE += 0.5 * tileSize;
        BONUS.STAR_RANGE > 2 * tileSize ? BONUS.STAR_RANGE = 2 * tileSize : null;
      };
    },
    class StarRangeDowngrade {
      id = "StarRangeDowngrade";
      tile = "star";
      bonus = "rangeDown";
      isBonus = false;
      description = `Star range is shortened.`;
      function = () => {
        BONUS.STAR_RANGE -= 0.5 * tileSize;
        BONUS.STAR_RANGE < -2 * tileSize ? BONUS.STAR_RANGE = -2 * tileSize : null;
      };
    }
  ];

  // core/levelUp/levelUp.js
  var choices = 2;
  function levelUpScreen() {
    let buttons = [];
    let cards = [];
    tileMap.players[0].level++;
    const levelUpScreen2 = document.getElementById("levelUpScreen");
    const levelNumber = document.getElementById("levelNumber");
    levelNumber.innerText = "Level : " + tileMap.players[0].level;
    levelNumber.style.position = "absolute";
    levelNumber.style.width = `${gameScreen.width}px`;
    levelNumber.style.margin = `${tileSize / 2}px`;
    levelNumber.style.textAlign = "center";
    levelNumber.style.fontSize = `${10 * pixelUnit}px`;
    const isBonus = Math.random() < 0.5 ? true : false;
    levelUpScreen2.classList.remove("disable");
    for (let card = 0; card < choices; card++) {
      drawCards2(levelUpScreen2, cards, buttons, isBonus);
    }
  }
  function drawCards2(levelUpScreen2, cards, buttons, isBonus) {
    const buttonSize = { width: 256 * pixelUnit, height: 384 * pixelUnit };
    const Xpos = tileSize * 2 + buttonSize.width * buttons.length + buttons.length * tileSize;
    const Ypos = tileSize * 2;
    let cardForSelectionArray = [];
    CARD_FOR_LEVEL_UP.forEach((card2) => {
      cardForSelectionArray.push(new card2());
    });
    const cardForSelection = cardForSelectionArray.filter((card2) => {
      return card2.isBonus === isBonus;
    });
    let card = cardForSelection[Math.floor(Math.random() * cardForSelection.length)];
    while (cards.some((existingCard) => existingCard.id === card.id)) {
      card = cardForSelection[Math.floor(Math.random() * cardForSelection.length)];
    }
    cards.push(card);
    const cardImg = ASSETS["cardLevelUp"].cloneNode();
    const newButton = document.createElement("button");
    levelUpScreen2.appendChild(newButton);
    newButton.appendChild(cardImg);
    cardImg.style.width = "100%";
    cardImg.style.height = "100%";
    cardImg.style.left = "0px";
    cardImg.style.top = "0px";
    newButton.id = `cardLevelUp_${buttons.length}`;
    newButton.style.width = `${buttonSize.width}px`;
    newButton.style.height = `${buttonSize.height}px`;
    newButton.style.left = `${Xpos}px`;
    newButton.style.top = `${Ypos}px`;
    newButton.style.width = `${buttonSize.width}px`;
    newButton.style.height = `${buttonSize.height}px`;
    const cardTile = document.createElement("img");
    const tile = buttonSize.width * 2 / 3;
    newButton.append(cardTile);
    cardTile.src = `./assets/src/images/${card.tile}.png`;
    cardTile.style.width = `${tile}px`;
    cardTile.style.height = `${tile}px`;
    cardTile.style.top = `${0 * pixelUnit}px`;
    cardTile.style.left = `${0 * pixelUnit}px`;
    const cardBonus = document.createElement("img");
    newButton.append(cardBonus);
    const bonus = tile / 2;
    cardBonus.src = `./assets/src/images/${card.bonus}.png`;
    cardBonus.style.width = `${bonus}px`;
    cardBonus.style.height = `${bonus}px`;
    cardBonus.style.top = `${tile / 2}px`;
    cardBonus.style.left = `${tile}px`;
    const cardDescription = document.createElement("p");
    newButton.append(cardDescription);
    const buttonUnit = tile / 32;
    cardDescription.innerHTML = card.description;
    cardDescription.style.width = `${buttonSize.width - 16 * buttonUnit}px`;
    cardDescription.style.top = `${tile + 4 * buttonUnit}px`;
    cardDescription.style.left = `${buttonUnit * 8}px`;
    cardDescription.style.textAlign = "center";
    cardDescription.style.fontSize = `${9 * pixelUnit}px`;
    cardDescription.style.lineHeight = `${tileSize / 2}px`;
    newButton.onclick = () => {
      card.function();
      card.id === "PlaceSpawnPoint" || card.id === "Spawn" ? null : generateSpawn();
      levelUpScreen2.classList.add("disable");
      playSound("clic");
      inverseLeveUp();
      inversePause();
    };
    buttons.push(newButton);
  }

  // player/thunder.js
  var Thunder = class {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.minSegmentHeight = 5;
      this.groundHeight = this.y;
      this.color = "hsl(180, 80%, 100%)";
      this.roughness = 2;
      this.maxDifference = this.y / 5;
      this.lightningArray = [];
      this.maxRadius = tileSize * 2;
      this.radius = 0;
      this.damage = 100;
    }
    update(ctx) {
      ctx.strokeStyle = this.color;
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = 1 * pixelUnit;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.stroke();
      ctx.restore();
      this.radius += 6 * pixelUnit;
      monsters.forEach((monster, index) => {
        monster.distance = Math.hypot(this.x - monster.x, this.y - monster.y);
        if (monster.distance < this.radius - monster.hitBox) {
          hitMonsters(monster, this.damage);
        }
      });
      var lightning = this.createLightning();
      this.lightningArray.push(lightning);
      ctx.beginPath();
      for (var i = 0; i < lightning.length; i++) {
        ctx.lineTo(lightning[i].x, lightning[i].y);
      }
      ctx.stroke();
    }
    createLightning() {
      var segmentHeight = tileSize;
      var lightning = [];
      lightning.push({ x: this.x + (Math.random() - 0.5) * tileSize * 2, y: 0 });
      lightning.push({
        x: this.x,
        y: this.y
      });
      var currDiff = this.maxDifference;
      while (segmentHeight > this.minSegmentHeight) {
        var newSegments = [];
        for (var i = 0; i < lightning.length - 1; i++) {
          var start = lightning[i];
          var end = lightning[i + 1];
          var midX = (start.x + end.x) / 2;
          var newX = midX + (Math.random() * 2 - 1) * currDiff;
          newSegments.push(start, { x: newX, y: (start.y + end.y) / 2 });
        }
        newSegments.push(lightning.pop());
        lightning = newSegments;
        currDiff /= this.roughness;
        segmentHeight /= 2;
      }
      return lightning;
    }
  };

  // core/handleClick.js
  var thunders = [];
  function handleClick(event) {
    if (event.x > gameScreen.width) {
      return;
    }
    if (selectedBtn) {
      CARD_ELEMENTS.some((card) => card.type === selectedBtn.type);
    }
    const cardSelected = selectedBtn ? CARD_ELEMENTS.find((card) => {
      return card.type === selectedBtn.type;
    }) : null;
    const xZero = marginLeft;
    const yZero = marginTop;
    const x = event.x - xZero;
    const y = event.y - yZero;
    const clickPositionInGrid = tileMap.getPosition(x, y);
    if (clickPositionInGrid.x === Math.floor(mapSizeX / 2) && clickPositionInGrid.y === Math.floor(mapSizeY / 2)) {
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
      updateSelectedBtn(void 0);
      renderCardDescription(selectedBtn);
      updatePause(false);
    }
    if (selectedBtn && selectedBtn.value > tileMap.players[0].stats.soulResource) {
      lowResources.push(new LowResource("resource"));
      return;
    }
    if (cardSelected && getNumberOfElement(cardSelected) >= cardSelected.maximum + cardSelected.increaseBy && !isGod) {
      lowResources.push(new LowResource("maxTile"));
      return;
    }
    if (tileMap.map[clickPositionInGrid.y][clickPositionInGrid.x] === "green" && CARD_ELEMENTS.some((card) => card.type === selectedBtn.type) && (getNumberOfElement(cardSelected) < cardSelected.maximum + +cardSelected.increaseBy || isGod)) {
      emptyLowResourcesArray();
      tileMap.map[clickPositionInGrid.y][clickPositionInGrid.x] = selectedBtn.type;
      tileMap.players[0].stats.soulResource -= parseInt(selectedBtn.value);
      tileMap.players[0].updateHp(true);
      cleanMap();
      updateSelectedBtn(void 0);
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
        button.disabled === true ? button.disabled = false : null;
      }
    }
    if (selectedBtn && selectedBtn.type === "thunder" && selectedBtn.value <= tileMap.players[0].stats.soulResource && tileMap.players[0].stats.soulResource >= 0) {
      const thunder = new Thunder(x, y);
      thunders.push(thunder);
      playSound("thunderStrike");
      tileMap.players[0].stats.soulResource -= parseInt(selectedBtn.value);
      updateSelectedBtn(void 0);
      renderCardDescription(selectedBtn);
      const closeButton = document.getElementById("closeButton");
      if (closeButton) {
        closeButton.remove();
      }
      inversePause();
      for (let button of cardButtons) {
        button.disabled === true ? button.disabled = false : null;
      }
    }
    if (selectedBtn && selectedBtn.type === "bomb" && SOLID_ELEMENTS.includes(
      tileMap.map[clickPositionInGrid.y][clickPositionInGrid.x]
    ) && selectedBtn.value <= tileMap.players[0].stats.soulResource && tileMap.players[0].stats.soulResource >= 0) {
      tileMap.map[clickPositionInGrid.y][clickPositionInGrid.x] = selectedBtn.type;
      bombMecanics(clickPositionInGrid);
      tileMap.players[0].updateHp(true);
      tileMap.players[0].stats.soulResource -= parseInt(selectedBtn.value);
      updateSelectedBtn(void 0);
      renderCardDescription(selectedBtn);
      const closeButton = document.getElementById("closeButton");
      if (closeButton) {
        closeButton.remove();
      }
      inversePause();
      for (let button of cardButtons) {
        button.disabled === true ? button.disabled = false : null;
      }
      for (let i = 0; i < 40; i++) {
        particles.push(
          new Particle(x, y, Math.random() * 2 * pixelUnit, {
            x: Math.random() - 0.5,
            y: Math.random() - 0.5
          }, "white")
        );
      }
    }
  }

  // UI/gameOverScreen.js
  function gameOverScreen(level) {
    const gameOverScreen2 = document.getElementById("gameOverScreen");
    gameOverScreen2.classList.remove("disable");
    const mainMenuCanvas2 = document.getElementById("mainMenuCanvas");
    const mainMenu2 = document.getElementById("mainMenu");
    const gameOverScreenText = document.createElement("p");
    gameOverScreen2.appendChild(gameOverScreenText);
    gameOverScreenText.id = "gameOverScreenText";
    gameOverScreenText.innerText = `Level Reached : ${level}`;
    gameOverScreenText.style.fontSize = `${tileSize * 1.5}px`;
    gameOverScreenText.style.display = "flex";
    resetButton(true);
  }

  // app.js
  var isPause = true;
  function inversePause() {
    isPause = !isPause;
    updateStatusText(pixelUnit);
  }
  function updatePause(bool) {
    isPause = bool;
    updateStatusText(pixelUnit);
  }
  var monsters;
  var damageTexts;
  var lowResources = [];
  var particles = [];
  function emptyLowResourcesArray() {
    lowResources = [];
    const previousText = document.getElementById("lowResource");
    previousText ? previousText.remove() : null;
  }
  var canvasScreen2 = document.getElementById("canvasScreen");
  var ctxScreen = canvasScreen2.getContext("2d");
  var mainMenuCanvas = document.getElementById("mainMenuCanvas");
  var ctxmainMenuCanvas = canvasScreen2.getContext("2d");
  var musicMute = false;
  var soundMute = false;
  function musicMuteFunction() {
    musicMute = !musicMute;
  }
  function soundMuteFunction() {
    soundMute = !soundMute;
  }
  var tileMap;
  var delta = 0;
  var pauseDelta = 0;
  var levelUp = true;
  var selectedBtn;
  function inverseLeveUp() {
    levelUp = !levelUp;
    updateStatusText(pixelUnit);
  }
  function updateSelectedBtn(btn) {
    selectedBtn = btn;
  }
  var mainMenu = document.getElementById("mainMenu");
  var isGod = false;
  function initIsGod() {
    isGod = false;
  }
  var tileSize;
  var pixelUnit;
  var gameScreen;
  var sideScreen;
  var musicPause = false;
  async function initWorld() {
    await loadAssets(canvasScreen2);
    window.addEventListener("blur", () => {
      ASSETS["mainLoop"].pause();
      musicPause = true;
      isPause = true;
      updateStatusText(pixelUnit);
    });
    window.addEventListener("focus", (event) => {
      musicPause = false;
    });
    canvasScreen2.addEventListener("click", (event) => {
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
    screenInit(canvasScreen2);
    tileSize = tileMap.tileSize;
    document.documentElement.style.setProperty("--tileSize", tileSize + "px");
    pixelUnit = tileSize / 32;
    gameScreen = {
      width: mapSizeX * tileSize,
      height: mapSizeY * tileSize
    };
    sideScreen = {
      width: canvasScreen2.width - gameScreen.width,
      height: canvasScreen2.height
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
  function startGame() {
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
  var lastFrameTimeMs = 0;
  var lastTextFrameTimeMs = 0;
  var lastFrameBeforePause = 0;
  var maxFPS = 90;
  var deltaFactor = 10;
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
    if (timestamp < lastFrameTimeMs + 1e3 / maxFPS) {
      requestAnimationFrame(animate);
      return;
    }
    delta = (timestamp - lastFrameTimeMs) / deltaFactor;
    lastFrameTimeMs = timestamp;
    lastFrameBeforePause = timestamp;
    ctxScreen.clearRect(0, 0, canvasScreen2.width, canvasScreen2.height);
    drawBackGameBackground(ctxScreen, gameScreen);
    tileMap.draw(ctxScreen);
    const mainPlayer = tileMap.players[0];
    isGod ? mainPlayer.stats.soulResource = 99999999 : null;
    isGod ? mainPlayer.maxHp = 9999 : null;
    isGod ? mainPlayer.stats.hp = 9999 : null;
    spawnMonsters();
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
                y: Math.random() - 0.5
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
    for (let i = 0; i < tileMap.rivers.length; i++) {
      const river = tileMap.rivers[i];
      river.update(ctxScreen);
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
      if (thunder.radius >= thunder.maxRadius) {
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
        if (projectile.x + projectile.radius < 1 || projectile.y + projectile.radius < 1 || projectile.x - projectile.radius > gameScreen.width || projectile.y - projectile.radius > gameScreen.height) {
          setTimeout(() => {
            tower.projectiles.splice(projectileIndex, 1);
          });
        }
      });
    }
    drawSideScreenBackground(ctxScreen, gameScreen, sideScreen);
    tileMap.players.forEach((player, index) => {
      player.draw(ctxScreen);
      if (mainPlayer.stats.hp <= 0) {
        isPause = true;
        init();
        setTimeout(() => {
          gameOverScreen(mainPlayer.level);
        }, 300);
      }
      player.projectiles.forEach((projectile, projectileIndex) => {
        monsters.forEach((monster, index2) => {
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
        if (projectile.x + projectile.radius < 1 || projectile.y + projectile.radius < 1 || projectile.x - projectile.radius > gameScreen.width || projectile.y - projectile.radius > gameScreen.height) {
          setTimeout(() => {
            player.projectiles.splice(projectileIndex, 1);
          });
        }
      });
    });
    pauseDelta = 0;
    requestAnimationFrame(animate);
  }
  function cleanMap() {
    for (let row = 0; row < mapSizeY; row++) {
      for (let column = 0; column < mapSizeX; column++) {
        let tile = tileMap.map[row][column];
        if (tile === "green") {
          tileMap.map[row][column] = "0";
        }
      }
    }
  }
})

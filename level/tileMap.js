import { Player } from "../player/player.js";
import { createMap, map, mapSizeX, mapSizeY } from "./map.js";
import { Mountain } from "./element/mountain.js";
import { Temple } from "./element/temple.js";
import { Tower } from "./element/tower.js";
import { SpawnPoint } from "./spawningSpawnPoints.js";
import { Star } from "./element/star.js";
import { selectedBtn } from "../app.js";
import { Tree } from "./element/tree.js";
import { River } from "./element/river.js";
import { Lava } from "./element/lava.js";

export class TileMap {
  constructor() {
    this.tileSize = 0;
    this.mapOrigin = { x: 0, y: 0 };
    this.players = [];

    this.greenTile = new Image();
    this.greenTile.src = "./src/images/greenTile.png";

    this.greenTileFull = new Image();
    this.greenTileFull.src = "./src/images/greenTileFull.png";

    this.mountain = new Image();
    this.mountain.src = "./src/images/mountain.png";
    this.mountains = [];

    this.temple = new Image();
    this.temple.src = "./src/images/temple.png";
    this.temples = [];

    this.tree = new Image();
    this.tree.src = "./src/images/tree.png";
    this.trees = [];

    this.tower = new Image();
    this.tower.src = "./src/images/tower.png";
    this.towers = [];

    this.lava = new Image();
    this.lava.src = "./src/images/lavaAnimation.png";
    this.lavas = [];

    this.river = new Image();
    this.river.src = "./src/images/riverAnimation.png";
    this.rivers = [];

    this.desert = new Image();
    this.desert.src = "./src/images/desert.png";
    this.deserts = [];

    this.star = new Image();
    this.star.src = "./src/images/star.png";
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
          if (
            !this.players.some(
              (player) =>
                player.position.x === column && player.position.y === row
            )
          ) {
            let player = new Player(
              this.tileSize * column + this.tileSize / 2,
              this.tileSize * row + this.tileSize / 2,
              { x: column, y: row },
              this.tileSize,
              "./src/images/god.png"
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
          if (
            !this.mountains.some(
              (mountain) =>
                mountain.position.x === column && mountain.position.y === row
            )
          ) {
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
          if (
            !this.temples.some(
              (temple) =>
                temple.position.x === column && temple.position.y === row
            )
          ) {
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
          if (
            !this.trees.some(
              (tree) => tree.position.x === column && tree.position.y === row
            )
          ) {
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
          if (
            !this.towers.some(
              (tower) => tower.position.x === column && tower.position.y === row
            )
          ) {
            let tower = new Tower(column, row);
            this.towers.push(tower);
          }
        }

        if (tile === "lava") {
          if (selectedBtn && selectedBtn.type === "bomb") {
            ctx.drawImage(
              this.greenTileFull,
              column * this.tileSize,
              row * this.tileSize,
              this.tileSize,
              this.tileSize
            );
          }
          if (
            !this.lavas.some(
              (lava) => lava.position.x === column && lava.position.y=== row
            )
          ) {
            let lava = new Lava(column, row, this.lava);
            this.lavas.push(lava);
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
          if (
            !this.deserts.some(
              (desert) => desert.column === column && desert.row === row
            )
          ) {
            let desert = { column: column, row: row };
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
          if (
            !this.rivers.some(
              (river) => river.position.x === column && river.position.y=== row
            )
          ) {
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
          if (
            !this.stars.some(
              (star) => star.position.x === column && star.position.y === row
            )
          ) {
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
          if (
            !this.spawnPoints.some(
              (spawnPoint) =>
                spawnPoint.position.x === column &&
                spawnPoint.position.y === row
            )
          ) {
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
      this.stars,
    ];

    this.elements = [
      { type: "mountain", element: this.mountains },
      { type: "temple", element: this.temples },
      { type: "tree", element: this.trees },
      { type: "tower", element: this.towers },
      { type: "star", element: this.stars },
      { type: "river", element: this.rivers },
      { type: "desert", element: this.deserts },
      { type: "lava", element: this.lavas },
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
        if (
          x >= row * this.tileSize &&
          x < row * this.tileSize + this.tileSize
        ) {
          if (
            y >= column * this.tileSize &&
            y < column * this.tileSize + this.tileSize
          ) {
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

    // UP
    neighbors.push({
      position: { x: position.x, y: position.y - 1 },
      tileValue: position.y - 1 >= 0 ? map[position.y - 1][position.x] : "99",
    });

    // DOWN
    neighbors.push({
      position: { x: position.x, y: position.y + 1 },
      tileValue: map[position.y + 1][position.x],
    });

    // LEFT
    neighbors.push({
      position: { x: position.x - 1, y: position.y },
      tileValue: map[position.y][position.x - 1],
    });

    // RIGHT
    neighbors.push({
      position: { x: position.x + 1, y: position.y },
      tileValue: map[position.y][position.x + 1],
    });
    return neighbors;
  }
}

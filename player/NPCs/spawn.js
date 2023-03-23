import {
  isPause,
  pauseDelta,
  monsters,
  tileSize,
  tileMap,
  inverseLeveUp,
  particles,
} from "../../app.js";
import { Monster } from "./monster.js";
import { mapSizeX, mapSizeY } from "../../level/map.js";
import { marginTop, marginLeft } from "../../UI/ScreenInit.js";
import { MONSTERS_STATS } from "../../core/constants/monsters.js";
import { calculateInterval } from "../../core/utils.js";

const playerPos = {
  x: Math.floor(mapSizeX / 2),
  y: Math.floor(mapSizeY / 2),
};

let spawnGroundRate = 0.2;

let localPauseDelta = 0;

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
    highestLevelSpawn = tileMap.spawnPoints.reduce((max, spawnPoint) =>
      max.MaxmonstersCount > spawnPoint.MaxmonstersCount ? max : spawnPoint
    );
  }
  if (pauseDelta > 0) {
    localPauseDelta = pauseDelta;
  }
  for (let i = 0; i < tileMap.spawnPoints.length; i++) {
    const spawnPoint = tileMap.spawnPoints[i];
    if (
      highestLevelSpawn &&
      highestLevelSpawn.monstersCount === highestLevelSpawn.MaxmonstersCount
    ) {
      if (monsters.length === 0 && particles.length === 0) {
        inverseLeveUp();
        tileMap.spawnPoints.forEach((spawnPoint) => {
          spawnPoint.monstersCount = 0;
          spawnPoint.MaxmonstersCount++;
        });
      }
      return;
    }

    if (
      !isPause &&
      calculateInterval(
        timestamp,
        spawnPoint.lastGroundSpawn,
        1000 / spawnGroundRate,
        localPauseDelta
      )
    ) {
      const monsterSelectionArray = monsterSelection();
      const monsterSelected =
        monsterSelectionArray[
          Math.floor(Math.random() * monsterSelectionArray.length)
        ];
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

export function getGroundSpawnPosition(spawnPoint) {
  const position = { x: spawnPoint.x, y: spawnPoint.y };
  return position;
}

export function generateSpawn() {
  let x, y;
  if (Math.random() < 0.5) {
    x = Math.random() < 0.5 ? 0 : mapSizeX - 1;
    y = Math.floor(Math.random() * mapSizeY);
  } else {
    x = Math.floor(Math.random() * mapSizeX);
    y = Math.random() < 0.5 ? 0 : mapSizeY - 1;
  }
  while (
    tileMap.spawnPoints.some(
      (spawnPoint) => spawnPoint.position.x === x && spawnPoint.position.y === y
    )
  ) {
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

export { spawnMonsters };

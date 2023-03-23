import { map, mapSizeX, mapSizeY } from "../../level/map.js";
import { tileSize } from "../../app.js";
import {
  SOLID_ELEMENTS,
  FRANCHISSABLE_ELEMENTS,
} from "../../core/constants/tiles.js";

const toKey = (x, y) => `${x}x${y}`;

const findPath = (start, target, type) => {
  const queue = [];
  const parentForKey = {};
  const startKey = toKey(start.x, start.y);
  const targetKey = toKey(target.x, target.y);

  parentForKey[startKey] = {
    key: "",
    position: { x: -1, y: -1 },
  };

  queue.push(start);

  while (queue.length > 0) {
    const { x, y } = queue.shift();
    const currentKey = toKey(x, y);
    if (currentKey === targetKey) {
      break;
    }
    const neighbors = [
      { x, y: y - 1 }, // top
      { x: x + 1, y }, // right
      { x, y: y + 1 }, // bottom
      { x: x - 1, y }, // left
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
      if (
        type === "ground" &&
        SOLID_ELEMENTS.includes(tile) &&
        !FRANCHISSABLE_ELEMENTS.includes(tile)
      ) {
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
        key: currentKey,
        position: { x, y },
      };

      queue.push(neighbor);
    }
  }
  const lastPos = {
    x: target.x * tileSize + tileSize / 2,
    y: target.y * tileSize + tileSize / 2,
  };
  const path = [lastPos];

  let currentKey = targetKey;

  if (!parentForKey[targetKey]) {
    return;
  }

  parentForKey[targetKey].position = {
    x: target.x,
    y: target.y,
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

export default findPath;

let map = [];
const mapSizeX = 21;
const mapSizeY = 15;

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

export { createMap, map, mapSizeX, mapSizeY };

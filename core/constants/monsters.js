const MONSTERS_STATS = [
  {
    name: "worm",
    type: "ground",
    level: 1,
    hp: 6,
    force: 1,
    speed: 0.8,
  },
  {
    name: "spider",
    type: "ground",
    level: 3,
    hp: 10,
    force: 2,
    speed: 1.2,
  },
  {
    name: "fly",
    type: "air",
    level: 5,
    hp: 12,
    force: 4,
    speed: 1.5,
  },
  {
    name: "slime",
    type: "ground",
    level: 7,
    hp: 50,
    force: 3,
    speed: 0.7,
  },
  {
    name: "bat",
    type: "air",
    level: 7,
    hp: 23,
    force: 3,
    speed: 1.9,
  },
  {
    name: "skull",
    type: "ground",
    level: 9,
    hp: 82,
    force: 10,
    speed: 0.8,
  },
  {
    name: "ghost",
    type: "air",
    level: 12,
    hp: 100,
    force: 15,
    speed: 1.8,
  },
  {
    name: "bombMonster",
    type: "bomb",
    level: 9999,
    hp: 150,
    force: 1,
    speed: 2.5,
  },
];

const MONSTERS_LIST = [
  "worm",
  "slime",
  "bat",
  "skull",
  "spider",
  "fly",
  "ghost",
  "bombMonster",
];

export { MONSTERS_LIST, MONSTERS_STATS };

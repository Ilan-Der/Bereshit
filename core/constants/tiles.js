const CARD_ELEMENTS = [
  {
    type: "godTile",
    title: "GOD",
    description: "Our dear Lord.</br>This is US.",
  },
  {
    type: "spawnPoints",
    value: -10,
    title: "Spawn",
    increaseBy: 0,
    increaseMax: 10,
    maximum: 999,
    description:
      "Generate a spawning point.</br>Monster will start to pop from it.</br>Posing this tile will generate 10 manas.",
  },
  {
    type: "mountain",
    value: 5,
    title: "Mountain",
    increaseBy: 0,
    increaseMax: 10,
    maximum: 6,
    description:
      "A natural obstacle that will block path for any attacking monsters.</br></br>Each mountain increases the God's maximum HP.",
  },
  {
    type: "thunder",
    value: 50,
    title: "Thunder",
    description:
      "Create a lightning that strike monsters and deals 10 damages to all monsters in its area.",
  },
  {
    type: "river",
    value: 50,
    title: "River",
    increaseBy: 0,
    increaseMax: 50,
    maximum: 1,
    description: "The ground monster walking in it is drowned.",
  },
  {
    type: "temple",
    value: 20,
    title: "Temple",
    increaseBy: 0,
    increaseMax: 10,
    maximum: 3,
    description: "Generate resources.",
  },
  {
    type: "tower",
    value: 30,
    title: "Tower",
    increaseBy: 0,
    increaseMax: 10,
    maximum: 4,
    description: "A tower that will shoot on monsters.",
  },
  {
    type: "bomb",
    value: 20,
    title: "Bomb",
    description: "Destroy an element on the grid.",
  },
  {
    type: "lava",
    value: 30,
    title: "Lava",
    increaseBy: 0,
    increaseMax: 10,
    maximum: 4,
    description: "Any monster that pass through it take damage.",
  },
  {
    type: "desert",
    value: 30,
    title: "Desert",
    increaseBy: 0,
    increaseMax: 10,
    maximum: 4,
    description: "Any monster that pass through it are slowed down.",
  },
  {
    type: "tree",
    value: 100,
    title: "Tree",
    increaseBy: 0,
    increaseMax: 10,
    maximum: 4,
    description: "Heals.",
  },
  {
    type: "star",
    value: 20,
    title: "Star",
    increaseBy: 0,
    increaseMax: 10,
    maximum: 4,
    description: "Force monster to follow their path.",
  },
];

function resetTileCards() {
  for (let card of CARD_ELEMENTS) {
    card.increaseBy = 0;
  }
}

// Elements that ground monster must dodge

const SOLID_ELEMENTS = [
  "mountain",
  "river",
  "tower",
  "temple",
  "desert",
  "tree",
  "lava",
  "star",
];

const FRANCHISSABLE_ELEMENTS = ["lava", "river", "desert", "star"];

export {
  CARD_ELEMENTS,
  SOLID_ELEMENTS,
  FRANCHISSABLE_ELEMENTS,
  resetTileCards,
};

import { screenInit } from "../UI/ScreenInit.js";

const SOUNDS = [
  "mainLoop",
  "addTileSound",
  "clic",
  "damage",
  "godDamage",
  "resourcePoping",
  "shoot",
  "thunderStrike",
  "bombSound",
];

const IMAGES = [
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
  "godTile",
];

export const ASSETS = [];

export let ASSETS_COUNT = SOUNDS.length + IMAGES.length;

function loadingCallback(canvasScreen) {
  if (--ASSETS_COUNT === 0) {
  }
}

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

export async function loadAssets() {
  for (let i = 0; i < SOUNDS.length; i++) {
    let sound = SOUNDS[i];
    const ext = sound === "mainLoop" ? "mp3" : "wav";
    ASSETS[sound] = loadAudio(`./src/sounds/${sound}.${ext}`);
  }

  for (let i = 0; i < IMAGES.length; i++) {
    let image = IMAGES[i];
    ASSETS[image] = loadImage(`./src/images/${image}.png`);
  }

  for (const [name, asset] of Object.entries(ASSETS)) {
    ASSETS[name] = await asset;
  }
}

// export function loadAssets(canvasScreen) {
//   for (let i = 0; i < SOUNDS.length; i++) {
//     let sound = SOUNDS[i];
//     const ext = sound === "mainLoop" ? "mp3" : "wav";
//     ASSETS[sound] = new Audio(`./src/sounds/${sound}.${ext}`);
//     ASSETS[sound].addEventListener(
//       "canplaythrough",
//       () => loadingCallback(canvasScreen),
//       false
//     );
//   }

//   for (let i = 0; i < IMAGES.length; i++) {
//     let image = IMAGES[i];
//     ASSETS[image] = new Image();
//     ASSETS[image].src = `./src/images/${image}.png`;
//     ASSETS[image].addEventListener("load", () => loadingCallback(canvasScreen));
//   }
// }

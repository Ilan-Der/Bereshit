import {
  ctxScreen,
  inversePause,
  tileMap,
  tileSize,
  updateSelectedBtn,
} from "../../app.js";
import { mapSizeX, mapSizeY } from "../../level/map.js";
import { possibilityForClick } from "../utils.js";
import { BONUS } from "./bonus.js";

const CARD_FOR_LEVEL_UP = [
  class PlaceSpawnPoint {
    id = "PlaceSpawnPoint";
    tile = "spawnTile";
    bonus = "bonusBlank";
    bonusType = "other";
    description =
      "Place an spawn point anywhere in the screen border.</br>Gain 3 soul resources.";
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
    tile = "resourceTile";
    bonus = "bonus";
    bonusType = "bonus";
    description = "Gain 100 soul resources.";
    function = () => {
      tileMap.players[0].stats.soulResource += 100;
    };
  },
  class LoseResources {
    id = "LoseResources";
    tile = "resourceTile";
    bonus = "penalty";
    bonusType = "penalty";
    description = "Lose 100 soul resources.";
    function = () => {
      tileMap.players[0].stats.soulResource -= 100;
    };
  },
  class GainLife {
    id = "GainLife";
    tile = "healthCross";
    bonus = "bonus";
    bonusType = "bonus";
    description = "Gain 10 HP.";
    function = () => {
      tileMap.players[0].stats.hp += 10;
    };
  },
  class TowerForceUpgrade {
    id = "TowerForceUpgrade";
    tile = "tower";
    bonus = "force";
    bonusType = "bonus";
    description = "All towers gain + 1 attack.";
    function = () => {
      BONUS.TOWER_FORCE += 1;
    };
  },
  class TowerForceDowngrade {
    id = "TowerForceDowngrade";
    tile = "tower";
    bonus = "force";
    bonusType = "penalty";
    description = "All towers lose 1 attack.";
    function = () => {
      BONUS.TOWER_FORCE -= 1;
      BONUS.TOWER_FORCE < -2 ? (BONUS.TOWER_FORCE = -2) : null;
    };
  },
  class ThunderForceUpgrade {
    id = "ThunderForceUpgrade";
    tile = "thunder";
    bonus = "force";
    bonusType = "bonus";
    description = "All Thunders gain + 1 attack.";
    function = () => {
      BONUS.THUNDER_FORCE += 10;
    };
  },
  class ThunderForceDowngrade {
    id = "ThunderForceDowngrade";
    tile = "thunder";
    bonus = "force";
    bonusType = "penalty";
    description = "All Thunders lose 1 attack.";
    function = () => {
      BONUS.THUNDER_FORCE -= 10;
      BONUS.THUNDER_FORCE < -90 ? (BONUS.THUNDER_FORCE = -90) : null;
    };
  },
  class GodForceUpgrade {
    id = "GodForceUpgrade";
    tile = "godTile";
    bonus = "force";
    bonusType = "bonus";
    description = "God gains + 1 attack.";
    function = () => {
      BONUS.GOD_FORCE += 1;
    };
  },
  class GodForceDowngrade {
    id = "GodForceDowngrade";
    tile = "godTile";
    bonus = "force";
    bonusType = "penalty";
    description = "God lose 1 attack.";
    function = () => {
      BONUS.GOD_FORCE -= 1;
      BONUS.GOD_FORCE < -2 ? (BONUS.GOD_FORCE = -2) : null;
    };
  },
  class LavaForceUpgrade {
    id = "LavaForceUpgrade";
    tile = "lava";
    bonus = "force";
    bonusType = "bonus";
    description = `Lava gains + 1 attack.`;
    function = () => {
      BONUS.LAVA_FORCE += 1;
    };
  },
  class LavaForceDowngrade {
    id = "LavaForceDowngrade";
    tile = "lava";
    bonus = "force";
    bonusType = "penalty";
    description = "Lava lose 1 attack.";
    function = () => {
      BONUS.LAVA_FORCE -= 1;
      BONUS.LAVA_FORCE < -2 ? (BONUS.LAVA_FORCE = -2) : null;
    };
  },
  class TempleForceUpgrade {
    id = "TempleForceUpgrade";
    tile = "temple";
    bonus = "force";
    bonusType = "bonus";
    description = `Temple generate one more resource.`;
    function = () => {
      BONUS.TEMPLE_FORCE += 1;
    };
  },
  class TempleForceDowngrade {
    id = "TempleForceDowngrade";
    tile = "temple";
    bonus = "force";
    bonusType = "penalty";
    description = "Temple generate one less resource.";
    function = () => {
      BONUS.TEMPLE_FORCE -= 1;
      BONUS.TEMPLE_FORCE < -4 ? (BONUS.TEMPLE_FORCE = -4) : null;
    };
  },
  class TreeForceUpgrade {
    id = "TreeForceUpgrade";
    tile = "tree";
    bonus = "force";
    bonusType = "bonus";
    description = `Tree generate one more resource.`;
    function = () => {
      BONUS.TREE_FORCE += 1;
    };
  },
  class TreeForceDowngrade {
    id = "TreeForceDowngrade";
    tile = "tree";
    bonus = "force";
    bonusType = "penalty";
    description =
      "Tree generate one less more resource.</br> Be carefull, if value negative, it will hit and not heal.";
    function = () => {
      BONUS.TREE_FORCE -= 1;
      BONUS.TREE_FORCE < -2 ? (BONUS.TREE_FORCE = -2) : null;
    };
  },
  class TowerCooldownUpgrade {
    id = "TowerCooldownUpgrade";
    tile = "tower";
    bonus = "cooldown";
    bonusType = "bonus";
    description = `Towers shoot cooldown is decreased of 0.1 sec.`;

    function = () => {
      BONUS.TOWER_COOLDOWN -= 100;
      BONUS.TOWER_COOLDOWN < -700 ? (BONUS.TOWER_COOLDOWN = -700) : null;
    };
  },
  class TowerCooldownDowngrade {
    id = "TowerCooldownDowngrade";
    tile = "tower";
    bonus = "cooldown";
    bonusType = "penalty";
    description = `Towers shoot cooldown is increased of 0.1 sec.`;
    function = () => {
      BONUS.TOWER_COOLDOWN < 700 ? (BONUS.TOWER_COOLDOWN += 100) : null;
    };
  },
  class TempleCooldownUpgrade {
    id = "TempleCooldownUpgrade";
    tile = "temple";
    bonus = "cooldown";
    bonusType = "bonus";
    description = `Temples shoot cooldown is decreased of 0.1 sec.`;

    function = () => {
      BONUS.TEMPLE_COOLDOWN -= 10;
      BONUS.TEMPLE_COOLDOWN < -40 ? (BONUS.TEMPLE_COOLDOWN = -40) : null;
    };
  },
  class TempleCooldownDowngrade {
    id = "TempleCooldownDowngrade";
    tile = "temple";
    bonus = "cooldown";
    bonusType = "penalty";
    description = `Temples shoot cooldown is increased of 0.1 sec.`;
    function = () => {
      BONUS.TEMPLE_COOLDOWN < 70 ? (BONUS.TEMPLE_COOLDOWN += 10) : null;
    };
  },
  class TreeCooldownUpgrade {
    id = "TreeCooldownUpgrade";
    tile = "tree";
    bonus = "cooldown";
    bonusType = "bonus";
    description = `Trees shoot cooldown is decreased of 0.1 sec.`;

    function = () => {
      BONUS.TREE_COOLDOWN -= 10;
      BONUS.TREE_COOLDOWN < -40 ? (BONUS.TREE_COOLDOWN = -40) : null;
    };
  },
  class TreeCooldownDowngrade {
    id = "TreeCooldownDowngrade";
    tile = "tree";
    bonus = "cooldown";
    bonusType = "penalty";
    description = `Trees shoot cooldown is increased of 0.1 sec.`;
    function = () => {
      BONUS.TREE_COOLDOWN < 70 ? (BONUS.TREE_COOLDOWN += 10) : null;
    };
  },
  class GodCooldownUpgrade {
    id = "GodCooldownUpgrade";
    tile = "godTile";
    bonus = "cooldown";
    bonusType = "bonus";
    description = `God shoot cooldown is decreased of 0.1 sec.`;

    function = () => {
      BONUS.GOD_COOLDOWN -= 100;
      BONUS.GOD_COOLDOWN < -700 ? (BONUS.GOD_COOLDOWN = -700) : null;
    };
  },
  class GodCooldownDowngrade {
    id = "GodCooldownDowngrade";
    tile = "godTile";
    bonus = "cooldown";
    bonusType = "penalty";
    description = `God shoot cooldown is increased of 0.1 sec.`;
    function = () => {
      BONUS.GOD_COOLDOWN < 700 ? (BONUS.GOD_COOLDOWN += 100) : null;
    };
  },
  class LavaCooldownUpgrade {
    id = "LavaCooldownUpgrade";
    tile = "lava";
    bonus = "cooldown";
    bonusType = "bonus";
    description = `Lava cooldown is decreased of 0.1 sec.`;

    function = () => {
      BONUS.LAVA_COOLDOWN -= 100;
      BONUS.LAVA_COOLDOWN < -700 ? (BONUS.LAVA_COOLDOWN = -700) : null;
    };
  },
  class LavaCooldownDowngrade {
    id = "LavaCooldownDowngrade";
    tile = "lava";
    bonus = "cooldown";
    bonusType = "penalty";
    description = `Lava cooldown is increased of 0.1 sec.`;
    function = () => {
      BONUS.LAVA_COOLDOWN < 700 ? (BONUS.LAVA_COOLDOWN += 100) : null;
    };
  },
  class GodRangeDowngrade {
    id = "GodRangeDowngrade";
    tile = "godTile";
    bonus = "range";
    bonusType = "penalty";
    description = `God range is shortened.`;
    function = () => {
      BONUS.GOD_RANGE -= 0.5 * tileSize;
      BONUS.GOD_RANGE < -2 * tileSize
        ? (BONUS.GOD_RANGE = -2 * tileSize)
        : null;
    };
  },
  class GodRangeUpgrade {
    id = "GodRangeUpgrade";
    tile = "godTile";
    bonus = "range";
    bonusType = "bonus";
    description = `God range is expended.`;
    function = () => {
      BONUS.GOD_RANGE += 0.5 * tileSize;
      BONUS.GOD_RANGE > 2 * tileSize ? (BONUS.GOD_RANGE = 2 * tileSize) : null;
    };
  },
  class TowerRangeDowngrade {
    id = "TowerRangeDowngrade";
    tile = "tower";
    bonus = "range";
    bonusType = "penalty";
    description = `Tower range is shortened.`;
    function = () => {
      BONUS.TOWER_RANGE -= 0.5 * tileSize;
      BONUS.TOWER_RANGE < -2 * tileSize
        ? (BONUS.TOWER_RANGE = -2 * tileSize)
        : null;
    };
  },
  class TowerRangeUpgrade {
    id = "TowerRangeUpgrade";
    tile = "tower";
    bonus = "range";
    bonusType = "bonus";
    description = `Tower range is expended.`;
    function = () => {
      BONUS.TOWER_RANGE += 0.5 * tileSize;
      BONUS.TOWER_RANGE > 2 * tileSize
        ? (BONUS.TOWER_RANGE = 2 * tileSize)
        : null;
    };
  },
  class StarRangeUpgrade {
    id = "StarRangeUpgrade";
    tile = "star";
    bonus = "range";
    bonusType = "bonus";
    description = `Star range is expended.`;
    function = () => {
      BONUS.STAR_RANGE += 0.5 * tileSize;
      BONUS.STAR_RANGE > 2 * tileSize
        ? (BONUS.STAR_RANGE = 2 * tileSize)
        : null;
    };
  },
  class StarRangeDowngrade {
    id = "StarRangeDowngrade";
    tile = "star";
    bonus = "range";
    bonusType = "penalty";
    description = `Star range is shortened.`;
    function = () => {
      BONUS.STAR_RANGE -= 0.5 * tileSize;
      BONUS.STAR_RANGE < -2 * tileSize
        ? (BONUS.STAR_RANGE = -2 * tileSize)
        : null;
    };
  },
  class ThunderRangeUpgrade {
    id = "ThunderRangeUpgrade";
    tile = "thunder";
    bonus = "range";
    bonusType = "bonus";
    description = `Thunder range is expended.`;
    function = () => {
      BONUS.THUNDER_RANGE += 0.5 * tileSize;
      BONUS.THUNDER_RANGE > 2 * tileSize
        ? (BONUS.THUNDER_RANGE = 2 * tileSize)
        : null;
    };
  },
  class ThunderRangeDowngrade {
    id = "ThunderRangeDowngrade";
    tile = "thunder";
    bonus = "range";
    bonusType = "penalty";
    description = `Thunder range is shortened.`;
    function = () => {
      BONUS.THUNDER_RANGE -= 0.5 * tileSize;
      BONUS.THUNDER_RANGE < -2 * tileSize
        ? (BONUS.THUNDER_RANGE = -2 * tileSize)
        : null;
    };
  },
  class DesertSpeedUpgrade {
    id = "DesertSpeedUpgrade";
    tile = "desert";
    bonus = "speed";
    bonusType = "bonus";
    description = "Increase desert slowness.";
    function = () => {
      BONUS.DESERT_SPEED === 0.1 ? null : (BONUS.DESERT_SPEED -= 0.1);
    };
  },
  class DesertSpeedDowngrade {
    id = "DesertSpeedDowngrade";
    tile = "desert";
    bonus = "speed";
    bonusType = "penalty";
    description =
      "Decrease desert slowness.</br>If superior to 1, monster speed will be increased.";
    function = () => {
      BONUS.DESERT_SPEED += 0.1;
    };
  },
];

export { CARD_FOR_LEVEL_UP };

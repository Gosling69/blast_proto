# Blast Puzzle Game

Simple blast game prototype built with **Cocos Creator 2.4**.

---

## Level Configuration

Level presets and gameplay balancing settings are located at:

`/Script/shared/shared.constants.ts`

| Field                         | Type                 | Description                                                   |
| ----------------------------- | -------------------- | ------------------------------------------------------------- |
| `targetScore`                 | `number`             | Score required to complete the round                          |
| `numTurnsLeft`                | `number`             | Number of turns available to the player                       |
| `numBombBoosters`             | `number`             | Initial amount of bomb boosters|
| `bombRadius`                  | `number`             | Explosion radius for bomb boosters                            |
| `numTeleportBoosters`         | `number`             | Initial amount of teleport boosters                           |
| `boardHeight`                 | `number`             | Height of the game board                                      |
| `boardWidth`                  | `number`             | Width of the game board                                       |
| `groupSizeForSuperSpawn`      | `number`             | Minimum connected group size required to spawn a special tile |
| `groupSizeSettings`           | `TGroupSizeSettings` | Constraints used during initial board generation              |
| `initialConnectedGroupsRatio` | `number`             | Ratio of connected groups generated on initial board spawn    |
| `boardShufflesLeft`           | `number`             | Number of available board reshuffles                          |
| `minGroupSizeForTurn`         | `number`             | Minimum connected group size required for a valid move        |

---

Nightmare level is the one to test shuffle functionality (simply swap two cells of the same color)
Shuffle function is also available as console command:

```ts
shuffle()
```

in window console

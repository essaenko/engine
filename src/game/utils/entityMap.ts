import { Enimy, Player, Fps, StatusBar } from "game/entities"
import { Entity } from "core/entity";

type Entities = typeof Enimy | typeof Player | typeof Entity;

export const entities: Dict<Entities> = {
  rogue: Enimy,
  player: Player,
  fps: Fps,
  cladbone: Entity,
  statusbar: StatusBar,
}
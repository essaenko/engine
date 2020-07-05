import { Character } from "game/entities/character";
import { ClassModule } from "game/modules";

export interface ISpell {
  id: number;
  code: string;
  title: string;
  description: string;
  damageType: 'physic' | 'magic',
  animation: 'slash' | 'cast',
  range: number;
  class: ClassModule['state']['title']
  damage: (stats: Character['state']['stats']) => number;
  cost: (stats: Character['state']['stats']) => number;
}

export const spellMap: ISpell[] = [
  {
    id: 1,
    code: 'slash',
    title: 'Удар',
    description: 'Наносит цели удар оружием',
    damageType: 'physic',
    animation: 'slash',
    class: 'warrior',
    range: 10,
    cost: (stats: Character['state']['stats']) => 10 + stats.intellegence * 1.5,
    damage: (stats: Character['state']['stats']) => stats.strenght + 10,
  },
  {
    id: 2,
    code: 'hit',
    title: 'Удар',
    description: 'Наносит цели удар оружием',
    damageType: 'physic',
    animation: 'slash',
    class: 'hunter',
    range: 10,
    cost: (stats: Character['state']['stats']) => 0,
    damage: (stats: Character['state']['stats']) => stats.agile * 1.5 + 10,
  }
]
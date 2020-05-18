import { Module, IModuleInitialState } from "../module";
import { Character } from "game/entities/character";
import { ISpell, spellMap } from "game/utils/spellMap";

export interface IClassModuleInitialState extends IModuleInitialState {
  title: 'warrior' | 'mage' | 'hunter' | 'druid';
  parent: Character;
}

export interface IClassModuleState extends IClassModuleInitialState {
}

export class ClassModule extends Module {
  public state: IClassModuleState;
  private spells: ISpell[] = spellMap;
  private timeout: number;
  
  constructor (state: IClassModuleInitialState) {
    super(state);

    this.initialiseRegen();
  }

  private initialiseRegen = () => {
    this.timeout = setTimeout(this.regeneration, 1000);
  }

  private regeneration = () => {
    if (this.timeout) clearTimeout(this.timeout);
    
    const { parent } = this.state;
    const newStats: { health?: number, mana?: number } = {};

    if (parent.state.stats.health > 0 && parent.state.stats.health < parent.state.stats.maxHealth) {
      newStats.health = Math.clamp(
        0,
        parent.state.stats.maxHealth,
        parent.state.stats.health + parent.state.stats.strenght / 2
      )
    }
    
    if (parent.state.stats.health > 0 && parent.state.stats.mana < parent.state.stats.maxMana) {
      newStats.mana = Math.clamp(
        0,
        parent.state.stats.maxMana,
        parent.state.stats.mana + parent.state.stats.intellegence / 2
      )
    }

    parent.setState({ stats: { ...parent.state.stats, ...newStats } });
    this.timeout = setTimeout(this.regeneration, 1000);
  }

  public spellRange = (name: string): number => this.spells.find((spell: ISpell) => spell.code === name).range;

  public castSpell = (name: string, target: Character): boolean => {
    const { parent } = this.state;
    const spell: ISpell = this.spells.find((spell) => spell.code === name);
    const spellCost: number = spell.cost(parent.state.stats);
    if (parent.state.stats.mana >= spellCost && target.state.stats.health > 0) {
      parent.reduceMana(spellCost);
      target.takeDamage(
          spell.damage(parent.state.stats),
          parent
      )

      return true;
    }

    return false;
  }

  public getSpell = (name: string): ISpell => this.spells.find((spell) => spell.code === name);
}
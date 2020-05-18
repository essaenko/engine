import { Entity } from "core/entity";
import { IEntityState, IEntityInitialState } from "core/entity/entity";
import { Module, ClassModule } from "game/modules";
import { ILoopTickEvent } from "core/eventbus/events";
import { levels } from 'game/utils/expirienceMap';

export interface ICharacterInitialState extends IEntityInitialState {
  stats: {
    agile: number;
    strenght: number;
    intellegence: number;
    health: number;
    armor: number;
    mana: number;
  };
  class: ClassModule['state']['title'];
  expirience: number;
  level: number;
}

export interface ICharacterState extends IEntityState {
  stats: {
    agile: number;
    strenght: number;
    intellegence: number;
    health: number;
    mana: number
    maxHealth: number;
    maxMana: number;
    armor: number;
  };
  expirience: number;
  level: number;
  class: ClassModule['state']['title']
  death: boolean;
  name: string;
  target: Entity | Character;
  lastMove: 'top' | 'down' | 'left' | 'right',
}

export type ModuleMap = Module | ClassModule;

export class Character extends Entity {
  public state: ICharacterState;
  public modules: {
    class: ClassModule,
  } = {
    class: null,
  };
  public onDeath: () => void;

  constructor(state: ICharacterInitialState) {
    super(state);
    this.setState<ICharacterState>({
      stats: {
        ...this.state.stats,
        health: state.stats.strenght * 15,
        mana: state.stats.intellegence * 15,
        maxHealth: state.stats.strenght * 15,
        maxMana: state.stats.intellegence * 15,
      },
      class: state.class,
      expirience: state.expirience || 0,
      level: state.level,
      death: false,
    })
  }

  public checkDisabledState = (event: ILoopTickEvent) => {
    const { stats: { health }, death } = this.state;
    if (health === 0 && !death) {
      this.setState({ following: null, death: true });
      const dsound = this.state.scene.assets.getSound('death');
      if (dsound) {
        this.state.scene.game.state.sound.play({ url: dsound });
      }
      this.updateAnimation('death', true);
      this.onAnimationEnd(() => this.updateAnimation('death'));
      if (this.onDeath) {
        this.onDeath();
      }
    }
  }

  public findNearestTarget = () => {
    const { scene, posX, posY, target: currentTarget } = this.state;
    const target = scene.near({ x: posX, y: posY }, 200, [this, currentTarget]);
    if (target) {
      this.setState({ target });
      target.setState({ drawShape: true });
    }
  }

  public useModule = (name: string, module: ModuleMap) => {
    this.modules[name] = module;
  }

  public unuseModule = (exclude: string) => {
    delete this.modules[exclude];
  }

  public castSpell = (name: string) => {
    const { target, lastCastKeyDown, lastMove, scene } = this.state;
    const range = this.modules.class.spellRange(name);
      if (
        target &&
        this.inRange(target, range) &&
        lastCastKeyDown + 1000 < Date.now() &&
        target instanceof Character
      ) {
        if (this.modules.class.castSpell(name, target)) {
          this.updateAnimation(`attack_${lastMove}`, true);
          scene.game.state.sound.play({
            url: scene.assets.getAsset('sounds', this.modules.class.getSpell(name).animation),
          });
          this.onAnimationEnd(() => this.setState({ animation: lastMove }))
          this.setState({ lastCastKeyDown: Date.now() });
          if (target.state.death) {
            this.reachExp(100);
          } else {
            console.log(target.state.death);
          }
        }
      }
  }

  public reduceMana = (cost: number) => this.setState({ stats: { ...this.state.stats, mana: this.state.stats.mana - cost } });

  public takeDamage = (damage: number, emitter: Character) => {
    const { stats, stats: { health, maxHealth, armor } } = this.state;
    const newHealth: number = health - (damage - damage * (armor / 1000));
    if (newHealth >= 0 && newHealth <= maxHealth) {
      this.setState({
        stats: {
          ...stats,
          health: newHealth,
        }
      });
    } else if (newHealth <= 0) {
      emitter.reachExp(100);
      this.setState({
        stats: {
          ...stats,
          health: 0,
          death: true,
        }
      });
    }
  }

  public levelUp = () => {
    const { level, stats } = this.state;
    this.setState({ level: level + 1, stats: { ...stats, ...{
      agile: stats.agile + 2,
      strenght: stats.strenght + 2,
      intellegence: stats.intellegence + 2,
      maxHealth: (stats.strenght + 2) * 15,
      maxMana: (stats.intellegence + 2) * 15,
      health: (stats.strenght + 2) * 15,
      mana: (stats.intellegence + 2) * 15,
    } } });
    const lvlupSound = this.state.scene.assets.getSound('levelup');
    if (lvlupSound) {
      this.state.scene.game.state.sound.play({ url: lvlupSound, volume: 0.2 });
    }
  }

  public reachExp = (exp: number) => {
    const { expirience, level } = this.state;
    if (levels[level] > expirience + exp) {
      this.setState({ expirience: expirience + exp });
    } else {
      this.levelUp();
      this.setState({ expirience: expirience + exp -  levels[level]});
    }
  }
}
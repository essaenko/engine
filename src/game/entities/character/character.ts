import { Entity } from "core/entity";
import { IEntityState, IEntityInitialState } from "core/entity/entity";
import { Module, ClassModule } from "game/modules";
import { ILoopTickEvent } from "core/eventbus/events";
import { levels } from 'game/utils/expirienceMap';
import { classes } from 'game/utils/classMap';
import { SpriteSheet } from "core/assets/spritesheet";

export interface ICharacterInitialState extends IEntityInitialState {
  class: ClassModule['state']['title'];
  expirience: number;
  level: number;
  stats?: {
    health: number;
    mana: number;
  };
  effectsSprite?: SpriteSheet;
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
  lastMove: 'top' | 'down' | 'left' | 'right';
  effects: string[];
  effectsSprite?: SpriteSheet;
}

export type ModuleMap = Module | ClassModule;

export class Character extends Entity {
  public state: ICharacterState;
  public modules: {
    class: ClassModule,
  } = {
    class: null,
  };
  public onDeath: (target: Character) => void;

  constructor(state: ICharacterInitialState) {
    super(state);
    const classTemplate = classes[state.class];

    this.setState<ICharacterState>({
      stats: {
        intellegence: classTemplate.stats.intellegence + classTemplate.levelIncrease.intellegence * (state.level - 1),
        agile: classTemplate.stats.agile  + classTemplate.levelIncrease.agile * (state.level - 1),
        strenght: classTemplate.stats.strenght  + classTemplate.levelIncrease.strenght * (state.level - 1),
        armor: classTemplate.stats.armor + ((classTemplate.stats.agile  + classTemplate.levelIncrease.agile * (state.level - 1)) / 5),
        health: state?.stats?.health !== void 0 ? state?.stats?.health : (classTemplate.stats.strenght  + classTemplate.levelIncrease.strenght * (state.level - 1)) * 15,
        mana: state?.stats?.mana !== void 0 ? state?.stats?.mana : (classTemplate.stats.intellegence + classTemplate.levelIncrease.intellegence * (state.level - 1)) * 15,
        maxHealth: (classTemplate.stats.strenght  + classTemplate.levelIncrease.strenght * (state.level - 1)) * 15,
        maxMana: (classTemplate.stats.intellegence + classTemplate.levelIncrease.intellegence * (state.level - 1)) * 15,
      },
      class: state.class,
      expirience: state.expirience || 0,
      level: state.level,
      death: false,
      effects: [],
      posX: state.posX || 250,
      posY: state.posY || 350,
      lastMove: 'down',
      effectsSprite: state.effectsSprite,
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
        this.onDeath(this);
      }
    }
  }

  public findNearestTarget = () => {
    const { scene, posX, posY, target: currentTarget } = this.state;
    const target = scene.near({ x: posX, y: posY }, 200, [this, currentTarget]).find((e) => e instanceof Character);
    if (target && target instanceof Character) {
      if (currentTarget) currentTarget.setState({ drawShape: false });
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
    const { level, stats, effects } = this.state;
    this.setState({
      level: level + 1,
      stats: {
        ...stats,
        ...{
          agile: stats.agile + 2,
          strenght: stats.strenght + 2,
          intellegence: stats.intellegence + 2,
          maxHealth: (stats.strenght + 2) * 15,
          maxMana: (stats.intellegence + 2) * 15,
          health: (stats.strenght + 2) * 15,
          mana: (stats.intellegence + 2) * 15,
        }
      },
      effects: [...effects, 'levelup'],
    });
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

  public renderHealthBar = (context: CanvasRenderingContext2D) => {
    const { posX, posY, width, scale, stats } = this.state;
    const { camera } = this.state.scene.state;
    context.fillStyle = 'black';
    context.fillRect(
      (posX - camera.state.x - (scale.x / 2) + ((width + scale.x - 26) / 2)) * camera.state.scale,
      (posY - scale.y - camera.state.y) * camera.state.scale,
      52,
      8
    );
    context.fillStyle = '#b72804';
    context.fillRect(
      (posX - camera.state.x - (scale.x / 2) + ((width + scale.x - 26) / 2)) * camera.state.scale + 1,
      (posY - scale.y - camera.state.y) * camera.state.scale + 1,
      stats.health / stats.maxHealth * 50,
      6
    );
  }

  public renderEffects = (context: CanvasRenderingContext2D) => {
    const { effects, effectsSprite, scene: { state: { camera } }, width, height, scale, posX, posY } = this.state;
    if (effects.includes('levelup')) {
      effectsSprite.animation.state['levelUp'].play();
      effectsSprite.animation.state['levelUp'].onAnimationEnd = () => this.setState({ effects: effects.filter((effect) => effect !== 'levelup') });
      effectsSprite.render(context, {
        animation: 'levelUp',
        width: (width + scale.x) * camera.state.scale,
        height: 30,
        posX: (posX - camera.state.x - scale.x / 2) * camera.state.scale,
        posY: (posY + height - 5 - camera.state.y) * camera.state.scale,
      });
    }
  }
}
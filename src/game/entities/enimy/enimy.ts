import {Entity, IEntityInitialState} from 'core/entity';

import { IPathNode } from 'core/pathfinder';
import { ICollisionEvent, ILoopTickEvent } from 'core/eventbus/events';
import { Character, ICharacterInitialState } from '../character';
import { ClassModule } from 'game/modules';
import { SpriteSheet } from 'core/assets/spritesheet';
import { Player } from '../player';

interface IActions {
  aggro?: {
    distance: number;
    spawn: IPathNode;
  }
}

export interface IEnimyInitialState {
  name: string;
  posX: number,
  posY: number,
  sprite: SpriteSheet,
  actions?: IActions,
  class: ClassModule['state']['title'],
}

export class Enimy extends Character {
  public actions: IActions = {};
  
  constructor(state: IEnimyInitialState) {
    super({
      ...state,
      physics: {
        gravityY: 0,
        gravityX: 0,
      },
      width: 10,
      height: 16,
      fill: 'white',
      scale: {
        x: 22,
        y: 16,
      },
      expirience: 0,
      level: 2,
      title: 'rogue',
    });
    this.actions = state.actions;
    this.useModule('class', new ClassModule({
      title: state.class,
      parent: this,
    }))
  }

  public onCollision = (collision: ICollisionEvent) => {
    const { x, y, target } = collision;

    if (target instanceof Player) {
      if (x) {
        this.posX = 0;
      }
      if (y) {
        this.posY = 0;
      }
    }

    if (this.state.following && this.state.following.entity === target) {
      this.stopFollow();
    }
  };

  public onDeath = () => setTimeout(() => {
    const { aggro: { spawn } } = this.actions;
    this.setState({ posX: spawn.x, posY: spawn.y, death: false, stats: { ...this.state.stats, health: this.state.stats.maxHealth, mana: this.state.stats.maxMana } });
    this.updateAnimation('down');
  }, 30 * 1000);

  public update = (event: ILoopTickEvent) => {
    const { scene, target, death, posX, posY } = this.state;
    const { aggro } = this.actions;
    if (aggro !== void 0 && !death) {
      const near: Character = <Character>scene.near(aggro.spawn, aggro.distance, [this]).find((e) => e instanceof Player);

      if (near && !near.state.death) {
        if (this.inRange(near, this.modules.class.spellRange('hit'))) {
          this.setState({ target: near });
          this.castSpell('hit');
        } else {
          this.setState({ target: near });
          this.followEntity(near);
        }
      } else if (target) {
        this.setState({ target: null });
        this.updateAnimation(this.state.animation, false);
        if (posX !== aggro.spawn.x && posY !== aggro.spawn.y) {
          this.followNode(aggro.spawn);
        }
      }
    }

    this.checkDisabledState(event);
  }
}
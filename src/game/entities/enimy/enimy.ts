import {Entity, IEntityInitialState} from 'core/entity';

import { IPathNode } from 'core/pathfinder';
import { ICollisionEvent, ILoopTickEvent } from 'core/eventbus/events';
import { ICharaterInitialState, Character } from '../character';
import { ClassModule } from 'game/modules';

interface IActions {
  aggro?: {
    distance: number;
    spawn: IPathNode;
  }
}

export class Enimy extends Character {
  private actions: IActions = {};
  
  constructor(state: ICharaterInitialState & { actions: IActions }) {
    super(state);
    this.actions = state.actions;
    this.useModule('class', new ClassModule({
      title: state.class,
      parent: this,
    }))
  }

  public onCollision = (collision: ICollisionEvent) => {
    const { x, y, target } = collision;

    if (x) {
      this.posX = 0;
    }
    if (y) {
      this.posY = 0;
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
      const near = scene.near(aggro.spawn, aggro.distance, [this]);

      if (near) {
        if (this.inRange(near, this.modules.class.spellRange('hit'))) {
          this.setState({ target: near });
          this.castSpell('hit');
        } else {
          this.setState({ target: near });
          this.followEntity(near);
        }
      } else if (target) {
        this.setState({ target: null });
        if (posX !== aggro.spawn.x && posY !== aggro.spawn.y) {
          this.followNode(aggro.spawn);
        }
      }
    }

    this.checkDisabledState(event);
  }
}
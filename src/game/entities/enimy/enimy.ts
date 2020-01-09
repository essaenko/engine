import {Entity} from 'core/entity';

import { logger } from 'game/utils/logger';

interface IActions {
  aggro?: {
    distance: number;
    spawn: IPathNode;
  }
}

export class Enimy extends Entity {
  private actions: IActions = {};
  
  constructor(state) {
    super(state);
    this.actions = state.actions;
  }

  public update = (event) => {
    const { scene, target } = this.state;
    const { aggro } = this.actions;
    if (aggro !== void 0) {
      const near = scene.near(aggro.spawn, aggro.distance, [this]);

      if (near) {
        this.setState({ target: near });
        this.followEntity(near);
      } else if (target) {
        this.setState({ target: null });
        this.followNode(aggro.spawn);
      }
    }
  }
}
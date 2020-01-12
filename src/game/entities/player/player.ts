import { Entity } from 'core/entity';

export class Player extends Entity {
  public state: Entity['state'] & {
    stats: {
      agile: number;
      strenght: number;
      intellegence: number;
      health: number;
      mana: number
    };
  };

  constructor(state) {
    super({...state, ...{ stats: { ...state.stats, health: state.stats.strenght * 2, mana: state.stats.intellegence * 2 } }});
  }
  
  public update = (event) => {
    const { speed } = this.state;
    let [ moveX, moveY ] = [0, 0];
    
    this.updateAnimation(false);
    if (this.input.isKeyPressed('S')) {
      moveY = 1;
      this.updateAnimation('down', true);
    }
    if (this.input.isKeyPressed('W')) {
      moveY = -1;
      this.updateAnimation('top', true);
    }
    if (this.input.isKeyPressed('D')) {
      moveX = 1;
      this.updateAnimation('right', true);
    }
    if (this.input.isKeyPressed('A')) {
      moveX = -1;
      this.updateAnimation('left', true);
    }
  
    if (this.input.isKeyPressed('E')) {
      this.followEntity(this.collisions[0]);
    }
  
    if (this.input.isKeyPressed('Q')) {
      this.stopFollow();
    }
    
    this.posY += speed * moveY;
    this.posX += speed * moveX;
  };
}

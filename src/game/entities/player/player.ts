import { Entity } from 'core/entity';

export class Player extends Entity {
  public state;

  constructor(state) {
    super(state);
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
    
    this.posY += speed * moveY;
    this.posX += speed * moveX;
  };
  
  updateAnimation = (animation, play?) => {
    if (this.state.sprite) {
      if (animation) {
        this.setState({ animation });
        if (play) {
          this.state.sprite.animation.state[animation].play();
        }
      } else {
        this.state.sprite.animation.state[this.state.animation].stop();
      }
    }
  }
}

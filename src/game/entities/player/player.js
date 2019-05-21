import { Entity } from '../../../core';

export class Player extends Entity {
  constructor(state) {
    super(state);
  }
  
  update = (event) => {
    const { speed } = this.state;
    let [ moveX, moveY ] = [0, 0];

    if (this.input.isKeyPressed('A')) {
      moveX = -1;
    }
    if (this.input.isKeyPressed('S')) {
      moveY = 1;
    }
    if (this.input.isKeyPressed('D')) {
      moveX = 1;
    }
    if (this.input.isKeyPressed('W')) {
      moveY = -1;
    }
    
    this.posY += speed * moveY;
    this.posX += speed * moveX;
  };
}

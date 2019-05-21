import {Core} from 'core/core';
import {KeyBoard} from 'core/input';

export class Entity {
  constructor(initialState) {
    this.state = { ...{
        speed: 1,
        physics: {
          gravityY: 0,
          gravityX: 0,
        }
      }, ...initialState };
    
    this.input = new KeyBoard();
    this.collisions = [];
    Core.eventBus.subscribe('game:start', this.startListenLoop);
  }
  
  startListenLoop = () => {
    Core.eventBus.subscribe('loop:tick', this.updateProxy);
  };
  
  updateProxy = (event) => {
    const { physics } = this.state;
    this.posY = physics.gravityY;
    this.posX = -physics.gravityX;
    
    this.input.update(event);
    this.update(event);
    this.checkCollisions();
    this.applyChanges();
  };
  
  checkCollisions = () => {
    const { posX, posY, width, height } = this.state;

    this.collisions.forEach(entity => {
      const { posX: ePosX, posY: ePosY, width: eWidth, height: eHeight } = entity.state;
      const [nextX, nextY] = [(posX + this.posX), (posY + this.posY)];
  
      if (
        (nextX < ePosX + eWidth) &&
        (nextX + width > ePosX) &&
        (nextY < ePosY + eHeight) &&
        (nextY + height > ePosY)
      ) {
        if (
          (nextX < ePosX + eWidth) &&
          (nextX + width > ePosX)
        ) {
          this.posX = 0;
        }
        if (
          (nextY < ePosY + eHeight) &&
          (nextY + height > ePosY)
        ) {
          this.posY = 0;
        }
      }
    });
  };
  
  setCollision = (object) => {
    this.collisions.push(object);
  };
  
  applyChanges = () => {
    this.state.posX += this.posX;
    this.state.posY += this.posY;
  };
  
  setEntityInToLayer = (context) => {
    const {
      posY,
      posX,
      width,
      height,
    } = this.state;
    if (posY < 0 ) {
      this.state.posY = 0;
    } else if (posY + height> context.canvas.height) {
      this.state.posY = context.canvas.height - height;
    }
  
    if (posX < 0) {
      this.state.posX = 0;
    } else if (posX + width  > context.canvas.width) {
      this.state.posX = context.canvas.width - width;
    }
  };
  
  render = (context) => {
    let { state: {
      posX,
      posY,
      width,
      height,
      fill,
    } } = this;
    this.setEntityInToLayer(context);

    if (this.state.sprite) {
    
    } else {
      context.fillStyle = fill;
      context.fillRect(posX, posY, width, height);
    }
  }
}

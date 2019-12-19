import {Core} from 'core/core';
import {KeyBoard} from 'core/input';

export interface IEntity {
  state: {
    posX: number;
    posY: number;
  };
  input: any;
  collisions: IEntity[];
  posX: number;
  posY: number;
  update: (event: any) => void;
}

export class Entity implements IEntity {
  public state;
  public input;
  public collisions;
  public posX;
  public posY;
  public update;

  constructor(initialState) {
    this.state = {
      ...{
        speed: 1,
        physics: {
          gravityY: 0,
          gravityX: 0,
        },
        animation: 'down',
        scaleHeight: 0,
        scaleWidth: 0,
      }, ...initialState
    };
    
    this.input = new KeyBoard();
    this.collisions = [];
  }
  
  setState = (state) => this.state = { ...this.state, ...state };
  
  public init = () => {
    Core.eventBus.subscribe('loop:tick', this.updateProxy);
  };
  
  destroy = () => {
    Core.eventBus.unsubscribe('loop:tick', this.updateProxy);
  };
  
  public updateProxy = (event) => {
    const { physics: { gravityY, gravityX } } = this.state;
    this.posY = gravityY;
    this.posX = -gravityX;
    
    this.input.update(event);
    if (this.update) {
      this.update(event);
    }
    this.checkCollisions();
    this.applyChanges();
  };
  
  checkCollisions = () => {
    const {posX, posY, width, height} = this.state;
    
    this.collisions.forEach(entity => {
      const {posX: ePosX, posY: ePosY, width: eWidth, height: eHeight} = entity.state;
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
    if (posY < 0) {
      this.state.posY = 0;
    } else if (posY + height > context.canvas.height) {
      this.state.posY = context.canvas.height - height;
    }
    
    if (posX < 0) {
      this.state.posX = 0;
    } else if (posX + width > context.canvas.width) {
      this.state.posX = context.canvas.width - width;
    }
  };
}

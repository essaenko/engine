import {AnimationGroup, Animation} from '../animation';

export interface ISpriteState {
    xBorder?: number;
    xOffset?: number;
    yBorder?: number;
    yOffset?: number;
    row: number;
    col: number;
    width: number;
    height: number;
    image: HTMLImageElement;
    animation?: Animation | AnimationGroup;
  }

export class SpriteSheet {
  public state: ISpriteState; 

  constructor(initState: ISpriteState) {
    this.state = initState;
  }
  
  private xCoord = (frameNumber: number | number[]) => {
    if (Array.isArray(frameNumber)) {
      const isFrameWithBorder = frameNumber[0] === 0;

      return (isFrameWithBorder && (this.state.xBorder || 0)) +
        (!isFrameWithBorder && (this.state.xOffset || 0)) +
        this.state.width * frameNumber[0];
    }

    const frameColumn = frameNumber % this.state.row;
    const isFrameWithBorder = frameColumn === 0;
    
    return (isFrameWithBorder && (this.state.xBorder || 0)) +
    (!isFrameWithBorder && (this.state.xOffset || 0)) +
    this.state.width * frameColumn;
  };
  
  private yCoord = (frameNumber: number | number[]) => {
    if (Array.isArray(frameNumber)) {
      const isFrameWithBorder = frameNumber[1] === 0;
  
      return (isFrameWithBorder && (this.state.yBorder || 0)) +
        (!isFrameWithBorder && (this.state.yOffset || 0)) + this.state.height * frameNumber[1];
    }
    const frameRow = Math.floor(frameNumber/this.state.col);
    const isFrameWithBorder = frameRow === 0;
    
    return (isFrameWithBorder && (this.state.yBorder || 0)) +
    (!isFrameWithBorder && (this.state.yOffset || 0)) + this.state.height * frameRow;
  };
  
  private getPosition = (props) => {
    const {
      collisionShape,
      posX,
      posY,
      width,
      height,
      scaleHeight,
      scaleWidth
    } = props;
    const {
      width: spriteWidth,
      height: spriteHeight
    } = this.state;
    let [x, y] = [0, 0];
    
    switch (collisionShape) {
      case 'center':
        if (spriteWidth > width) {
          x = posX - (spriteWidth - width) / 2;
        } else {
          x = posX + (width - spriteWidth) / 2;
        }
        if (spriteHeight > height) {
          y = posY - (spriteHeight - height) / 2;
        } else {
          y = posY + (height - spriteHeight) / 2;
        }
        break;
      case 'bottom':
        if (spriteWidth > width) {
          x = posX - (spriteWidth - width) / 2;
        } else {
          x = posX + (width - spriteWidth) / 2;
        }
        if (spriteHeight > height) {
          y = posY - (spriteHeight - height);
        } else {
          y = posY + (height - spriteHeight);
        }
        break;
      default:
        x = posX;
        y = posY;
        break;
    }
    x -= scaleWidth/2;
    y -= scaleHeight;
    
    return [x, y];
  };
  
  public getFrame = (frameNumber) => {
    return [
      this.state.image,
      this.xCoord(frameNumber),
      this.yCoord(frameNumber),
      this.state.width,
      this.state.height,
    ]
  };
  
  public useAnimation = (animation) => {
    this.state.animation = animation;
  };
  
  public get animation() {
    return this.state.animation;
  }
  
  public render = (context, props) => {
    const { getPosition, getFrame, state: { animation } } = this;
    const { animation: animationType, width, height, scaleHeight, scaleWidth } = props;
    let params = [];

    if (animation) {
      if (animation instanceof AnimationGroup) {
        params = [
          ...getFrame(animation.state[animationType].getFrameNumber()),
          ...getPosition(props),
          width + scaleWidth,
          height + scaleHeight,
        ];
      } else {
        if ('getFrameNumber' in animation) {
          params = [
            ...getFrame(animation.getFrameNumber()),
            ...getPosition(props),
            width + scaleWidth,
            height + scaleHeight,
          ];
        }
      }
    } else {
      params = [
        ...getFrame(0),
        ...getPosition(props),
        width,
        height,
      ];
    }
    context.drawImage(...params);
  };
}

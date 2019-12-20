import {AnimationGroup} from '../animation';

export class SpriteSheet implements ISpriteSheet {
  public state;
  constructor(initState = {}) {
    this.state = initState;
  }
  
  xCoord = (frameNumber: number) => {
    const frameColumn = frameNumber % this.state.row;
    const isFrameWithBorder = frameColumn === 0;
    
    return (isFrameWithBorder && (this.state.xBorder || 0)) +
    (!isFrameWithBorder && (this.state.xOffset || 0)) +
    this.state.width * frameColumn;
  };
  
  yCoord = (frameNumber) => {
    const frameRow = Math.floor(frameNumber/this.state.col);
    const isFrameWithBorder = frameRow === 0;
    
    return (isFrameWithBorder && (this.state.yBorder || 0)) +
    (!isFrameWithBorder && (this.state.yOffset || 0)) + this.state.height * frameRow;
  };
  
  getPosition = (props) => {
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
    x -= scaleWidth;
    y -= scaleHeight;
    
    return [x, y];
  };
  
  getFrame = (frameNumber) => {
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
  
  render = (context, props) => {
    const { getPosition, getFrame, state: { animation } } = this;
    const { animation: animationType, width, height, scaleHeight } = props;
    let params = [];

    if (animation) {
      if (animation instanceof AnimationGroup) {
        params = [
          ...getFrame(animation.state[animationType].getFrameNumber()),
          ...getPosition(props),
          width,
          height + scaleHeight,
        ];
      } else {
        params = [
          ...getFrame(animation.getFrameNumber()),
          ...getPosition(props),
          width,
          height,
        ];
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

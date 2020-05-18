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
  
  private xCoord = (framePosition: [number, number]): number => {
    const isFirstColumn = framePosition[0] === 0;

    return (isFirstColumn && (this.state.xBorder || 0)) +
           (!isFirstColumn && (this.state.xOffset || 0)) + 
           this.state.width * framePosition[0];
  };
  
  private yCoord = (framePosition: [number, number]): number => {
    const isFirstRow = framePosition[1] === 0;

    return (isFirstRow && (this.state.yBorder || 0)) +
           (!isFirstRow && (this.state.yOffset || 0)) +
           this.state.height * framePosition[1];
  };
  
  private getPosition = (props: {
    collisionShape?: 'center' | 'bottom';
    posX: number;
    posY: number;
    width: number;
    height: number;
    scale?: {
      x: number;
      y: number;
    }
  }): [number, number] => {
    const {
      collisionShape,
      posX,
      posY,
      width,
      height,
      scale,
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
    x -= scale.x/2;
    y -= scale.y;
    
    return [x, y];
  };
  
  public getFrame = (framePosition: [number, number]): [HTMLImageElement, number, number, number, number] => {
    return [
      this.state.image,
      this.xCoord(framePosition),
      this.yCoord(framePosition),
      this.state.width,
      this.state.height,
    ]
  };
  
  public useAnimation = (animation) => {
    this.state.animation = animation;
  };
  
  public get animation(): Animation | AnimationGroup {
    return this.state.animation;
  }
  
  public render = (context: CanvasRenderingContext2D, props: {
    animation?: string;
    width: number;
    height: number;
    scale?: {
      x: number;
      y: number;
    };
    posX: number;
    posY: number;
  }) => {
    const { animation } = this.state;
    const { animation: animationType, width, height, scale } = props;
    let params: (HTMLImageElement | number)[] = [
      ...this.getFrame([0, 0]),
      ...this.getPosition(props),
      width,
      height,
    ];

    if (animation) {
      if (animation instanceof AnimationGroup) {
        params = [
          ...this.getFrame(animation.state[animationType].getFramePosition()),
          ...this.getPosition(props),
          width + scale.x,
          height + scale.y,
        ];
      } else if (animation instanceof Animation) {
        params = [
          ...this.getFrame(animation.getFramePosition()),
          ...this.getPosition(props),
          width + scale.x,
          height + scale.y,
        ];
      }
    }
    //@ts-ignore
    context.drawImage(...params);
  };
}

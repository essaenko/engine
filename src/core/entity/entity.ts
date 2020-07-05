import {Core} from 'core/core';
import {KeyBoard} from 'core/input';
import {PathFinder} from 'core/pathfinder';
import { Scene } from 'core/scene';
import { SpriteSheet } from 'core/assets/spritesheet';

import { IPath, IPathNode } from 'core/pathfinder'
import { ILoopTickEvent, ICollisionEvent, ICanvasClick, ICanvasRegionClick } from 'core/eventbus/events';
import { AnimationGroup, Animation } from 'core/assets/animation';

export interface IEntityInitialState {
  posX: number;
  id?: number; 
  posY: number;
  width: number;
  height: number;
  physics?: {
    gravityX: number;
    gravityY: number;
  };
  speed?: number;
  fill?: string;
  sprite?: SpriteSheet;
  textContent?: {
    content: string | number;
    x: number;
    y: number;
    font: string;
    color: string;
    id: string;
    width: number;
    height: number;
  }[];
  drawShape?: boolean;
  drawPath?: boolean;
  animation?: string;
  title: string;
  scale?: {
    x: number;
    y: number;
  },
};

export interface IEntityState extends IEntityInitialState {
  id: number;
  scene?: Scene;
  physics: {
    gravityX: number;
    gravityY: number;
  };
  lastCastKeyDown: number;
  lastSystemKeyDown: number;
  following: {
    entity: Entity | IPathNode,
    path: IPath,
    point: number,
    canRecreatePath: boolean,
  };
  sounds: {
    step: number;
    cast: number;
  };
};

export class Entity {
  public state: IEntityState;
  public input: KeyBoard;
  public collisions: Entity[];
  public posX: number;
  public posY: number;
  public pathFinder: PathFinder = new PathFinder();

  public render: (context: CanvasRenderingContext2D) => void;
  public create: (scene: Scene) => void;
  public update: (event: any) => void;
  public onCollision: (event: ICollisionEvent) => void;
  public onSetState: <T>(state: T) => void;

  constructor(initialState: IEntityInitialState) {
    this.state = {
      ...{
        id: Math.random(),
        speed: 1,
        physics: {
          gravityY: 0,
          gravityX: 0,
        },
        animation: 'down',
        scale: {
          x: 0,
          y: 0,
        },
        following: null,
        lastCastKeyDown: null,
        lastSystemKeyDown: null,
        sounds: {
          step: null,
          cast: null,
        }
      }, ...initialState
    };
    
    this.input = new KeyBoard();
    this.collisions = [];
  }
  
  public setState = <T>(state: { [K in keyof T]?: T[K] }) => {
    this.state = { ...this.state, ...state }
    
    if (this.onSetState) {
      this.onSetState(this.state);
    }
  };
  
  private pathToEntity = (target: Entity | IPathNode): IPath => {
    const { posX, posY, scene: { state: { map } } } = this.state;
    let ePosX: number, ePosY: number;
    if ('state' in target) {
      ePosX = target.state.posX;
      ePosY = target.state.posY;
    } else {
      ePosX = target.x;
      ePosY = target.y;
    }

    const selfPos = [Math.floor(posX/map.state.tilewidth), Math.floor(posY/map.state.tileheight)];
    const entityPos = [Math.floor(ePosX/map.state.tilewidth), Math.floor(ePosY/map.state.tileheight)];
    if (selfPos[0] === entityPos[0] && selfPos[1] === entityPos[1]) {
      return void 0;
    }
    
    const rawPath = this.pathFinder.find(selfPos, entityPos, map.graph);
    
    return rawPath.filter((point: string) => point !== '').reduce((acc: any, point: string, index) => {
      const [x, y] = point.split(':');
      if (x && y) {
        acc[index] = {
          x: +x * +map.state.tilewidth + +map.state.tilewidth / 2,
          y: +y * +map.state.tileheight + +map.state.tileheight / 2,
        };
        acc.length = index + 1;
      }
      
      return acc;
    }, {});
  };
  
  public followNode = (pathNode: IPathNode): void => {
    if (!this.state.following || this.state.following.entity !== pathNode) {
      this.setState({
        following: {
          entity: pathNode,
          path: this.pathToEntity(pathNode),
          point: 0,
          canRecreatePath: false,
        },
      });
    }
  };
  
  public followEntity = (entity: Entity): void => {
    if (!this.state.following || this.state.following.entity !== entity || this.state.following.canRecreatePath) {
      this.setState({
        following: {
          entity,
          path: this.pathToEntity(entity),
          point: 0,
          canRecreatePath: false,
        },
      });
    }
  };
  
  private follow = () => {
    if (this.state.following) {
      const { following: { path, point = 0 }, posX, posY, speed, following } = this.state;
      let animation = '';
      if (path && path[point]) {
        if (path[point].x === posX && path[point].y === posY) {
          if (point !== path.length) {
            this.setState({ following: { ...following, point: point + 1, canRecreatePath: true } });
          } else {
            this.stopFollow();
          }
      
          return void 0;
        }
        this.setState({ following: { ...this.state.following, canRecreatePath: false } });
        this.posX = (path[point].x > posX ? 1 : path[point].x < posX ? -1 : 0) * speed;
        this.posY = (path[point].y > posY ? 1 : path[point].y < posY ? -1 : 0) * speed;
        if (this.posX < 0) animation = 'left';
        if (this.posX > 0) animation = 'right';
        if (this.posY < 0) animation = 'top';
        if (this.posY > 0) animation = 'down';

        if (animation) {
          this.updateAnimation(animation, true);
          this.setState({ lastMove: animation });
        };
      } else {
        this.stopFollow();
      }
    }
  };
  
  public stopFollow = (): void => {
    this.setState({
      following: null,
    });
    this.updateAnimation(this.state.animation, false);
  };

  public inRange = (target: Entity, range: number) => {
    const { posX, posY, width, height } = this.state;
    const { posX: ePosX, posY: ePosY, width: eWidth, height: eHeight } = target.state;

    return (posX - range < ePosX + eWidth) &&
        (posX + width + range > ePosX) &&
        (posY - range < ePosY + eHeight) &&
        (posY + height + range > ePosY);
  }
  
  public init = (scene: Scene) => {
    this.setState({ scene });
    if (this.create) {
      this.create(scene);
    }
    Core.eventBus.subscribe<ILoopTickEvent>('loop:tick', this.updateProxy);
  };
  
  public destroy = () => {
    Core.eventBus.unsubscribe<ILoopTickEvent>('loop:tick', this.updateProxy);
  };
  
  private updateProxy = (event: ILoopTickEvent) => {
    const { physics: { gravityY, gravityX }, following } = this.state;
    this.posY = gravityY;
    this.posX = -gravityX;
    
    this.input.update(event);
    if (this.update) {
      this.update(event);
    }
    if (following) {
      this.follow();
    }
    if (this.posX || this.posY) {
      this.checkCollisions();
    }
    this.applyChanges();
  };

  public checkClick = ({ nativeEvent: { clientX, clientY } }: ICanvasClick) => {
    const { posX, posY, width, height, scene: { state: { camera } } } = this.state;
    
    if (
      clientX >= (posX * camera.state.scale) - (camera.state.x * camera.state.scale) &&
      clientX <= (posX * camera.state.scale) - (camera.state.x * camera.state.scale) + (width * camera.state.scale) &&
      clientY >= (posY * camera.state.scale) - (camera.state.y * camera.state.scale) &&
      clientY <= (posY * camera.state.scale) - (camera.state.y * camera.state.scale) + (height * camera.state.scale)
    ) {
      Core.eventBus.dispatch<ICanvasRegionClick>(`clickOnEntity`, { target: this });
    }
  }
  
  public checkCollisions = () => {
    const { posX, posY, width, height, following } = this.state;
    this.collisions.forEach(entity => {
      const {posX: ePosX, posY: ePosY, width: eWidth, height: eHeight} = entity.state;
      const [nextX, nextY] = [(posX + this.posX), (posY + this.posY)];
      
      if (
        (nextX < ePosX + eWidth) &&
        (nextX + width > ePosX) &&
        (nextY < ePosY + eHeight) &&
        (nextY + height > ePosY)
      ) {
        const payload: ICollisionEvent = {
          x: false,
          y: false,
          target: entity,
        }
        if (
          (nextX < ePosX + eWidth) &&
          (nextX + width > ePosX)
        ) {
          payload.x = true;
        }
        if (
          (nextY < ePosY + eHeight) &&
          (nextY + height > ePosY)
        ) {
          payload.y = true;
        }
        
        if (following && entity === following.entity) {
          this.stopFollow();
        }
        
        if (this.onCollision) {
          this.onCollision(payload);
        }
        
        if (entity.onCollision) {
          entity.onCollision({ ...payload, target: this });
        }
      }
    });
    if (this.posX || this.posY) {
      this.state.scene.checkCollisions(this);
    }
  };

  public onAnimationEnd = (callback: () => void) => {
    const animation = this.getAnimation()
    animation.onAnimationEnd = callback;
  }

  private getAnimation = (): Animation => {
    if (this.state.sprite.animation instanceof AnimationGroup) {
      return this.state.sprite.animation.state[this.state.animation];
    } else if (this.state.sprite.animation instanceof Animation){
      return this.state.sprite.animation;
    }
  } 
  
  public updateAnimation = (anim: string, play: boolean = false) => {
    const { sprite, animation, scene, sounds } = this.state;
    if (sprite && animation) {
      if (typeof anim === 'string') {
        this.setState({ animation: anim });
        if (play) {
          sprite.animation.state[anim].play();
          if (Date.now() > sounds.step) {
            scene.game.state.sound.play({
              url: scene.assets.getAsset('sounds', 'step'),
              speed: 2,
            }).then((duration: number) => {
              this.setState({ sounds: { ...sounds, step: Date.now() + duration } });
            });
          }
        } else {
          sprite.animation.state[anim].stop();
        }
      }
    }
  };
  
  public setCollision = (object: Entity | Entity[]) => {
    if (Array.isArray(object)) {
      this.collisions.push(...object);
    } else {
      this.collisions.push(object);
    }
  };
  
  private applyChanges = () => {
    this.state.posX += this.posX;
    this.state.posY += this.posY;
  };
}

import {Core} from 'core/core';
import {KeyBoard} from 'core/input';
import {PathFinder} from 'core/pathfinder';

export class Entity implements IEntity {
  public state;
  public input;
  public collisions;
  public posX;
  public posY;
  public update;
  public pathFinder: IPathFinder = new PathFinder();

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
        following: null,
      }, ...initialState
    };
    
    this.input = new KeyBoard();
    this.collisions = [];
  }
  
  public setState = (state) => this.state = { ...this.state, ...state };
  
  private pathToEntity = (entity: IEntity): IPath => {
    const { posX, posY, scene: { state: { map: { tilemap: map } } } } = this.state;
    const { posX: ePosX, posY: ePosY } = entity.state;

    const selfPos = [Math.floor(posX/map.tilewidth), Math.floor(posY/map.tileheight)];
    const entityPos = [Math.floor(ePosX/map.tilewidth), Math.floor(ePosY/map.tileheight)];
    const rawPath = this.pathFinder.find(selfPos, entityPos, this.state.scene.state.mapGraph);
    
    return rawPath.reduce((acc: Dict<any>, point: string, index) => {
      const [x, y] = point.split(':');
      if (x && y) {
        acc[index] = {
          x: +x * +map.tilewidth + +map.tilewidth/2,
          y: +y * +map.tileheight + +map.tileheight/2,
        };
        acc.length = index + 1;
      }
      
      return acc;
    }, {});
  };
  
  public followEntity = (entity: IEntity): void => {
    if (!this.state.following || this.state.following.entity !== entity) {
      this.setState({
        following: {
          entity,
          path: this.pathToEntity(entity),
        },
      });
    }
  };
  
  private follow = () => {
    if (this.state.following) {
      const { following: { path, point = 0 }, posX, posY, speed, following } = this.state;
      let animation = '';
      if (path[point]) {
        if ((path[point].x - 2 < posX && posX < path[point].x + 2) && (path[point].y - 2 < posY && posY< path[point].y + 2)) {
          this.setState({ following: { ...following, point: point + 1 } });
      
          return void 0;
        }
        this.posX = (path[point].x > posX ? 1 : path[point].x < posX ? -1 : 0) * speed;
        this.posY = (path[point].y > posY ? 1 : path[point].y < posY ? -1 : 0) * speed;
        if (this.posX < 0) animation = 'left';
        if (this.posX > 0) animation = 'right';
        if (this.posY < 0) animation = 'top';
        if (this.posY > 0) animation = 'down';

        if (animation) this.updateAnimation(animation, true);
      } else {
        this.stopFollow();
      }
    }
  };
  
  public stopFollow = (): void => {
    this.setState({
      following: null,
    });
    this.updateAnimation(false);
  };
  
  public init = (scene: IScene) => {
    this.setState({ scene });
    Core.eventBus.subscribe('loop:tick', this.updateProxy);
  };
  
  public destroy = () => {
    Core.eventBus.unsubscribe('loop:tick', this.updateProxy);
  };
  
  public updateProxy = (event) => {
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
    if (this.posX || this.posY) {
      this.state.scene.checkCollisions(this);
    }
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

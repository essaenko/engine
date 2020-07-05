import { AssetManager } from 'core/asset-manager';
import { Core } from 'core/core';
import { Game } from 'core/game';
import { Entity } from 'core/entity';
import { Camera } from 'core/camera';

import { IPathNode } from 'core/pathfinder';
import { ICanvasClick, ILoopTickEvent } from 'core/eventbus/events';
import { Character } from 'game/entities/character';
import { Player, Enimy } from 'game/entities';
import { Map } from 'core/map';
import { IStoreScene, IStoreEntity } from 'core/store/store.types';

export interface ISceneInitialState {
  fill?: string;
  create?: (scene: Scene) => void;
  update?: (scene: Scene) => void;
  onCreate?: (scene: Scene) => void;
  onCatch?: (error: Error) => void;
  map?: Map;
  name?: string;
}

export class Scene {
  public state: {
    fill?: string;
    create?: (scene: Scene) => void;
    update?: (scene: Scene) => void;
    onCreate?: (scene: Scene) => void;
    onCatch?: (error: Error) => void;
    name?: string;
    camera?: Camera;
    width?: number;
    height?: number;
    map?: Map,
  };
  public assets: AssetManager;
  public game: Game;
  public entities: (Entity | Character)[] = [];

  constructor(initialState: ISceneInitialState = {}) {
    this.state = {...initialState};
  }
  
  private setState = (state: { [K in keyof Scene['state']]?: Scene['state'][K] }) => {
    this.state = {
      ...this.state,
      ...state,
    }
  };

  private updateProxy = (event: ILoopTickEvent) => {
    this.saveSceneToStore();
    if (this.state.update) {
      this.state.update(this);  
    }
  }
  
  public checkCollisions = (entity: Entity) => {
    const { map: { state: { width: tmWidth, height: tmHeight, tileheight: tHeight, tilewidth: tWidth, layers } } } = this.state;

    const { posX, posY, state } = entity;
    let [nextX, nextY] = [ (state.posX + posX), (state.posY + posY) ];
    const { data, visible } = layers.filter((layer) => layer.name === 'collision')[0];
    
    if (visible) return void 0;
  
    const collisionMap = data.reduce((acc, item) => {
      if (item !== 0) {
        acc.push(item - 1);
      } else {
        acc.push(null);
      }
    
      return acc
    }, []);
  
    collisionMap.forEach((tile, index) => {
      if (tile === null) return void 0;
    
      const [tPosX, tPosY] = [
        ((index - Math.floor(index/tmHeight) * tmWidth) * (tWidth)),
        (Math.floor(index/tmHeight) * (tHeight))
      ];
    
      if (
        (nextX < tPosX + tWidth) &&
        (nextX + state.width > tPosX) &&
        (nextY < tPosY + tHeight) &&
        (nextY + state.height > tPosY)
      ) {
        if (
          (nextX < tPosX + tWidth) &&
          (nextX + state.width > tPosX)
        ) {
          entity.posX = 0;
        }
        if (
          (nextY < tPosY + tHeight) &&
          (nextY + state.height > tPosY)
        ) {
          entity.posY = 0;
        }
      }
    });
  };

  /**
   * Debug methods
   */

  private drawDebugPath = (context: CanvasRenderingContext2D, entity: Entity) => {
    const { camera: { state: { x: xOffset, y: yOffset, scale } } } = this.state;

    if (entity.state.following && entity.state.following.path) {
      Object.values(entity.state.following.path).forEach((node: IPathNode) => {
        context.strokeStyle = 'green';
        context.strokeRect(node.x * scale - xOffset * scale, node.y * scale - yOffset * scale, 32 * scale, 32 * scale);
      });
    }
  }

  /**
   * Use methods
   */
  public usedByGame = async (game: Game) => {
    const { state: { width, height } } = game;
    this.game = game;
    this.assets = this.game.getAssetManager();
    this.setState({
      width,
      height,
    });
    try {
      await this.assets.load();
    } catch (e) {
      if (this.state.onCatch) {
        this.state.onCatch(e);
      } else {
        throw e;
      }
    }
    if (this.state.create) {
      this.state.create(this);
    }
    if (this.state.onCreate) {
      this.state.onCreate(this);
    }
    Core.eventBus.subscribe<ILoopTickEvent>('loop:tick', this.updateProxy);
  };
  
  public useEntities = (entities: Entity[]) => {
    this.entities.push(...entities);
    entities.forEach((entity) => {
      Core.eventBus.subscribe<ICanvasClick>('canvasClick', entity.checkClick);
      entity.init(this);
    });
  };
  
  public useCamera = (camera: Camera) => {
    const { height, tileheight, width, tilewidth } = this.state.map.state;
    this.setState({ camera });
    camera.setState({
      maxX: (width * tilewidth * camera.state.scale - camera.state.width) / camera.state.scale,
      maxY: (height * tileheight * camera.state.scale - camera.state.height) / camera.state.scale
    });
    //There are canvas element in property layer and we should exactly mutate him to place new properties
    this.game.state.layer.height = camera.state.height;
    this.game.state.layer.width = camera.state.width;
  };

  /**
   * Utilities methods
   */
  private get sortedEntities () {
    return this.entities.sort(
      ({ state: { posY: e1PosY, title } }, { state: { posY: e2PosY } }) =>
        title === 'statusbar'? 1 : e1PosY > e2PosY ? 1 : e1PosY < e2PosY ? -1 : 0
    )
  };

  public near = (sercher: IPathNode, distance: number, exclude?: Entity[]): Entity[] => {
    return this.entities.filter((entity) => {
        if (exclude.includes(entity)) return false;

        return Math.abs(sercher.x - entity.state.posX) <= distance && Math.abs(sercher.y - entity.state.posY) <= distance
      }
    ).sort((a: Entity, b: Entity) => Math.hypot(a.state.posX - sercher.x, a.state.posY - sercher.y) - Math.hypot(b.state.posX - sercher.x, b.state.posY - sercher.y));
  };

  public getEntityByProperty = (key: string, value: any): Entity => this.entities.filter((entity) => entity.state[key] === value)[0]

  private saveSceneToStore = () => {
    const scenes: IStoreScene[] = [...this.game.store.state.scenes];
    scenes.map((scene: IStoreScene) => {
      if (scene.name === this.state.name) {
        scene.entities = this.entities.reduce((acc, entity: Entity | Character | Enimy) => {
          const { state: { id, title, width, height, posX, posY } } = entity;
          const normalizedEntity: IStoreEntity = { id, title, posX, posY, width, height };

          if (entity instanceof Entity) {
            const { state: { sprite, speed, textContent, animation }, state } = entity;
            Object.assign(normalizedEntity, {
              sprite: sprite?.state.name,
              speed,
              textContent,
              animation,
            });
          }

          if (entity instanceof Character) {
            const { state: { expirience, level, name, stats }, state } = entity;
            Object.assign(normalizedEntity, {
              class: state.class,
              expirience,
              level,
              name,
              stats
            })
          }

          if (entity instanceof Enimy) {
            const { actions } = entity;
            Object.assign(normalizedEntity, {
              actions
            });
          }

          if (entity instanceof Player) {
            this.game.store.setState({ player: normalizedEntity });
          }

          acc.push(normalizedEntity);

          return acc;
        }, []);
      }
    });
    this.game.store.setState({ scenes });
  }
  
  public destroy = () => {
    this.saveSceneToStore();
    this.entities.forEach((entity) => {
      Core.eventBus.unsubscribe<ICanvasClick>('canvasClick', entity.checkClick);
      entity.destroy();
    });
    Core.eventBus.unsubscribe<ILoopTickEvent>('loop:tick', this.updateProxy);
  };

  /**
   * Render methods
   */

  private drawEntityShape = (context: CanvasRenderingContext2D, { state: { posX, posY, width, height } }: Entity) => {
    const { camera: { state: { x: xOffset, y: yOffset, scale } } } = this.state;
    context.strokeStyle = '#21de00';
    context.strokeRect((posX - 2) * scale - xOffset * scale, (posY - 2) * scale - yOffset * scale, (width + 4) * scale, (height + 2) * scale);
  };

  private renderCharacterEffects = (context: CanvasRenderingContext2D, entity: Character) => {
    entity.renderHealthBar(context);
    entity.renderEffects(context);
  }

  private renderEntities = (context: CanvasRenderingContext2D) => {
    const { camera: { state: { scale, x: xOffset, y: yOffset } } } = this.state;
    if (this.entities) {
      this.sortedEntities.forEach(entity => {
        let {
          posX,
          posY,
          width,
          height,
          fill,
          sprite,
          textContent,
          drawShape,
          drawPath,
        } = entity.state;
        
        if (typeof entity.render === 'function') {
          return void entity.render(context);
        }
        if (drawShape) {
          this.drawEntityShape(context, entity);
        }
        if (entity.state.following && !(entity.state.following.entity instanceof Entity) && entity instanceof Player) {
          const node = entity.state.following.path[entity.state.following.path.length - 1];
          if (node) {
            context.strokeStyle = '#21de00';
            context.strokeRect((node.x - 16) * scale - xOffset * scale, (node.y - 16) * scale - yOffset * scale, 32 * scale, 32 * scale);
          }
        }
  
        if (sprite) {
          if (entity instanceof Character) {
            this.renderCharacterEffects(context, entity);
          }
          sprite.render(
            context,
            {
              ...entity.state,
              width: entity.state.width * scale,
              height: entity.state.height * scale,
              scale: {
                x: entity.state.scale?.x * scale,
                y: entity.state.scale?.y * scale,
              },
              posX: entity.state.posX * scale - xOffset * scale,
              posY: entity.state.posY * scale -yOffset *scale,
            }
          );
        } else if (textContent) {
          textContent.forEach((textItem) => {
            const { content, x, y, font, color, id, width, height } = textItem;
            context.fillStyle = color;
            context.font = font;
            context.beginPath();
            context.rect(x,y, width, height);
            context.fillText(<string>content, x, y + height);
          });
        } else {
          context.fillStyle = fill;
          context.fillRect(posX - xOffset * scale, posY - yOffset * scale, width * scale, height * scale);
        }
        if (drawPath) {
          this.drawDebugPath(context, entity);
        }
      });
    }
  };

  public render = (context: CanvasRenderingContext2D) => {
    const { width, height, map } = this.state;

    if (!this.game.state.layer) {
      return void console.warn(`Can't render scene in game. Layer not defined. Use useLayer method of Game class to define it.`);
    }
    if (map) {
      map.render(context, this.assets, this.state.camera);
    } else {
      context.fillStyle = this.state.fill;
      context.fillRect(0,0, width, height);
    }
    this.renderEntities(context);
  };
}

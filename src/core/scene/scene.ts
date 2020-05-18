import { AssetManager } from 'core/asset-manager';
import { Core } from 'core/core';
import {Graph} from 'core/pathfinder/graph';
import { logger } from 'game/utils/logger';
import { Game } from 'core/game';
import { Entity } from 'core/entity';
import { Camera } from 'core/camera';

import { IPathNode } from 'core/pathfinder';
import { ICanvasClick, ICanvasRegionClick } from 'core/eventbus/events';

export interface ISceneInitialState {
  fill?: string;
  preload?: (scene: Scene) => void;
  create?: (scene: Scene) => void;
  update?: (scene: Scene) => void;
  onCatch?: (error: Error) => void;
  map?: {
    tileset: any;
    tilemap: any;
    atlas: string;
  };
  name?: string;
  title?: string;
  graph?: {
    allowDiagonals: boolean;
  },
}

export class Scene {
  public state: {
    fill?: string;
    preload?: (scene: Scene) => void;
    create?: (scene: Scene) => void;
    update?: (scene: Scene) => void;
    onCatch?: (error: Error) => void;
    map?: {
      tileset: any,
      tilemap: {
        width: number;
        height: number;
        tilewidth: number;
        tileheight: number;
        layers: {
          name: string;
          visible: boolean;
          data: number[];
        }[];
        scale: number;
      },
      atlas: string,
    };
    name?: string;
    mapGraph?: Graph;
    camera?: Camera;
    width?: number;
    height?: number;
    title?: string;
    graph?: {
      allowDiagonals: boolean;
    }
  };
  public assets: AssetManager;
  public game: Game;
  public entities: Entity[];

  constructor(initialState: ISceneInitialState = {}) {
    this.state = {...initialState};
    if (initialState.map) {
      this.state.mapGraph = new Graph({
        width: initialState.map.tilemap.width,
        height: initialState.map.tilemap.height,
        map: initialState.map.tilemap.layers.filter(({ name }) => name === 'collision')[0].data,
        ...initialState.graph
      });
    }
  }
  
  private setState = (state: { [K in keyof Scene['state']]?: Scene['state'][K] }) => {
    this.state = {
      ...this.state,
      ...state,
    }
  };
  
  public checkCollisions = (entity: Entity) => {
    const { tilemap: { width: tmWidth, height: tmHeight, tileheight: tHeight, tilewidth: tWidth, layers, scale = 1 }, tileset: { tiles } } = this.state.map;

    if (!tiles) return void 0;

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
        ((index - Math.floor(index/tmHeight) * tmWidth) * (tWidth * scale)),
        (Math.floor(index/tmHeight) * (tHeight * scale))
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
  public usedByGame = async (game) => {
    const { state: { width, height } } = game;
    this.game = game;
    this.assets = this.game.getAssetManager();
    this.setState({
      width,
      height,
    });
    if (this.state.preload) {
      this.state.preload(this);
    }
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
  };
  
  public useEntities = (entities: Entity[]) => {
    this.entities = entities;
    this.entities.forEach((entity) => {
      const { camera } = this.state;
      
      Core.eventBus.subscribe<ICanvasClick>('canvasClick', entity.checkClick);
      entity.init(this);
    });
  };
  
  public useCamera = (camera: Camera) => {
    const { height, tileheight, width, tilewidth } = this.state.map.tilemap;
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

  public near = (sercher: IPathNode, distance: number, exclude?: Entity[]): Entity => {
    return this.entities.filter((entity) => {
        if (exclude.includes(entity)) return false;

        return Math.abs(sercher.x - entity.state.posX) <= distance && Math.abs(sercher.y - entity.state.posY) <= distance
      }
    ).sort((a: Entity, b: Entity) => a.state.posX + a.state.posY - b.state.posX + b.state.posY)[0];
  };

  public getEntityByProperty = (key: string, value: any): Entity => this.entities.filter((entity) => entity.state[key] === value)[0]
  
  public destroy = () => {
    this.entities.forEach((entity) => {
      entity.destroy();
    })
  };

  /**
   * Render methods
   */

  private drawEntityShape = (context: CanvasRenderingContext2D, { state: { posX, posY, width, height } }: Entity) => {
    const { camera: { state: { x: xOffset, y: yOffset, scale } } } = this.state;
    context.strokeStyle = '#21de00';
    context.strokeRect((posX - 2) * scale - xOffset * scale, (posY - 2) * scale - yOffset * scale, (width + 4) * scale, (height + 2) * scale);
  };

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
        if (entity.state.following && !(entity.state.following.entity instanceof Entity)) {
          const node = entity.state.following.path[entity.state.following.path.length - 1];
          if (node) {
            context.strokeStyle = '#21de00';
            context.strokeRect((node.x - 16) * scale - xOffset * scale, (node.y - 16) * scale - yOffset * scale, 32 * scale, 32 * scale);
          }
        }
  
        if (sprite) {
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
          context.fillRect(posX, posY, width, height);
        }
        if (drawPath) {
          this.drawDebugPath(context, entity);
        }
      });
    }
  };

  private renderLayer = (context: CanvasRenderingContext2D, tilemap, tileset, layer, image: HTMLImageElement) => {
    const { data: tiles } = layer;
    const { columns, spacing = 0 } = tileset;
    const { tileheight, tilewidth } = tilemap;
    const { x: xOffset, y: yOffset, scale } = this.state.camera.state;
  
    if (!layer.visible) return void 0;
  
    for(let col = 0; col < layer.width; col++) {
      for(let row = 0; row < layer.height; row ++) {
        const tile = tiles[row * layer.width + col] - 1;
      
        if (tile <= 0) continue;
        context.drawImage(
          image,
          tilewidth * (tile - Math.floor(tile/columns) * columns) + (spacing * (tile - Math.floor(tile/columns) * columns)),
          tileheight * Math.floor(tile/columns) + spacing * Math.floor(tile/columns),
          tilewidth,
          tileheight,
          col * (tilewidth * scale) + Math.round(-xOffset * scale),
          row * (tileheight * scale) + Math.round(-yOffset * scale),
          ((tilewidth + 1) * scale),
          ((tileheight + 1) * scale),
        );
      }
    }
  };
  
  private renderMap = (context: CanvasRenderingContext2D) => {
    const { map: { tileset, tilemap: { layers, width, height }, atlas, tilemap } } = this.state;
    const { image } = this.assets.getTileset(atlas);
    layers.forEach((layer) => {
      this.renderLayer(context, tilemap, tileset, layer, image);
    });
  };

  public render = (context) => {
    const { width, height, map, camera } = this.state;

    if (!this.game.state.layer) {
      return void console.warn(`Can't render scene in game. Layer not defined. Use useLayer method of Game class to define it.`);
    }
    if (map) {
      this.renderMap(context);
    } else {
      context.fillStyle = this.state.fill;
      context.fillRect(0,0, width, height);
    }
    this.renderEntities(context);
  };
}

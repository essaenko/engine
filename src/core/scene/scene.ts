import { AssetManager } from 'core/asset-manager';
import {ICamera} from 'core/camera/camera';
import {IEntity} from 'core/entity/entity';
import { Core } from 'core/core';

export interface ISceneInitialState {
  fill?: string;
  preload?: (IScene) => void;
  create?: (IScene) => void;
  update?: (IScene) => void;
  map?: {
    tileset: any,
    tilemap: any,
    atlas: string,
  },
  name?: string,
}

export class Scene implements IScene {
  public state;
  public assets;
  public game;
  public entities;

  constructor(initialState: ISceneInitialState = {}) {
    this.state = {...initialState};
    this.assets = new AssetManager();
  }
  
  private setState = (state) => {
    this.state = {
      ...this.state,
      ...state,
    }
  };
  
  public checkCollisions = (entity: IEntity) => {
    const { tilemap: { width: tmWidth, height: tmHeight, tileheight: tHeight, tilewidth: tWidth, layers }, tileset: { tiles } } = this.state.map;

    if (!tiles) return void 0;

    const { posX, posY, state } = entity;
    let [nextX, nextY] = [ (state.posX + posX), (state.posY + posY) ];
    layers.forEach(({ data, visible, name }) => {
      if (!visible) return void 0;
      
      const collisionMap = data.reduce((acc, item, index) => {
        const tile = tiles.filter((tile) => tile.id === item - 1)[0];
        if (tile && tile.properties.some(({ name, value }) => (name === 'collision' && value))) {
          acc.push(item - 1);
        } else {
          acc.push(null);
        }

        return acc
      }, []);

      collisionMap.forEach((tile, index) => {
        if (tile === null) return void 0;

        const [tPosX, tPosY] = [
          ((index - Math.floor(index/tmHeight) * tmWidth) * tWidth),
          (Math.floor(index/tmHeight) * tHeight)
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
      
      // let tileID = data[Math.floor(nextY/theight) * tmHeight + Math.floor(nextX/tWidth)] - 1;
      // let tile = tileset.tiles.filter((tile) => tile.id === tileID)[0];
  
      // if (tile && tile.properties.some(({ name, value }) => (name === 'collision' && value))) {
      //   entity.posX = 0;
      //   entity.posY = 0;
        
      //   return void 0;
      // }
    });
  };
  
  private renderLayer = (context, tilemap, tileset, layer, image) => {
    const { data: tiles } = layer;
    const { columns, spacing = 0 } = tileset;
    const { tileheight, tilewidth } = tilemap;
    const { x: xOffset, y: yOffset} = this.state.camera.state;
  
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
          col * tilewidth + Math.floor(-xOffset),
          row * tileheight + Math.floor(-yOffset),
          tilewidth,
          tileheight,
        );
      }
    }
  };
  
  private renderMap = (context: CanvasRenderingContext2D, xOffset: number = 0, yOffset: number = 0, width: number = 0, height: number = 0) => {
    const { map: { tileset, tilemap: { layers }, atlas, tilemap } } = this.state;
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

  private drawDebugShape = (context: CanvasRenderingContext2D, { state: { posX, posY, width, height } }: IEntity) => {
    const { camera: { state: { x: xOffset, y: yOffset } } } = this.state;
    context.fillStyle = 'red';
    context.fillRect(posX - xOffset, posY - yOffset, width, height);
  }
  
  private renderEntities = (context) => {
    const { camera } = this.state;
    if (this.entities) {
      this.entities.forEach(entity => {
        let {
          posX,
          posY,
          width,
          height,
          fill,
          sprite,
          textContent,
          drawShape,
        } = entity.state;
  
        if (sprite) {
          sprite.render(
            context,
            {
              ...entity.state,
              posX: entity.state.posX - camera.state.x,
              posY: entity.state.posY - camera.state.y,
            }
          );
        } else if (textContent) {
          textContent.forEach((textItem) => {
            const { content, x, y, font, color, id, width, height } = textItem;
            context.fillStyle = color;
            context.font = font;
            context.beginPath();
            context.rect(x,y, width, height);
            context.fillText(content, x, y + height);
            if (context.addHitRegion) {
              context.addHitRegion({id});
            }
          });
        } else {
          context.fillStyle = fill;
          context.fillRect(posX, posY, width, height);
        }
        if (drawShape) {
          this.drawDebugShape(context, entity);
        }
      });
    }
  };
  
  public usedByGame = async (game) => {
    const { state: { width, height } } = game;
    this.game = game;
    this.setState({
      width,
      height,
    });
    if (this.state.preload) {
      this.state.preload(this);
    }
    await this.assets.load();
    if (this.state.create) {
      this.state.create(this);
    }
  };
  
  public useEntities = (entities) => {
    this.entities = entities;
    this.entities.forEach(({ state: { textContent }, init }) => {
      if (textContent) {
        textContent.forEach((textitem) => {
          Core.eventBus.subscribe('canvasClick', ({ clientX, clientY, region }: MouseUIEvent) => {
            if (
              region === `clickRegion${textitem.id}` ||
              (clientX >= textitem.x &&
                clientX <= textitem.x + textitem.width &&
                clientY >= textitem.y && clientY <= textitem.y + textitem.height)
            ) {
              Core.eventBus.dispatch(`clickRegion${textitem.id}`);
            }
          });
        })
      }
      init(this);
    });
  };
  
  public useCamera = (camera: ICamera) => {
    const { height, tileheight, width, tilewidth } = this.state.map.tilemap;
    this.setState({ camera });
    if (camera.state.scale) {
      this.game.state.layer.style.transform = `scale(${camera.state.scale})`;
      this.game.state.layer.style.marginTop = `${camera.state.height * (camera.state.scale - 1)/2}px`;
      this.game.state.layer.style.marginLeft = `${camera.state.width * (camera.state.scale - 1)/2}px`;
    }
    camera.setState({
      maxX: width * tilewidth - camera.state.width,
      maxY: height * tileheight - camera.state.height
    });
    this.game.state.layer.height = camera.state.height;
    this.game.state.layer.width = camera.state.width;
  };
  
  public destroy = () => {
    this.entities.forEach((entity) => {
      entity.destroy();
    })
  }
}

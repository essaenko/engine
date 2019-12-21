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
  }
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
    const { tilemap: { height: tmHeight, tileheight: theight, tilewidth: tWidth, layers }, tileset } = this.state.map;

    if (!tileset.tiles) return;

    const { posX, posY, state } = entity;
    const [nextX, nextY] = [
      (state.posX + posX + (posX > 0 ? state.width : 0)),
      (state.posY + posY + (posY > 0 ? state.height : 0))
    ];
    layers.forEach(({ data, visible }) => {
      if (!visible) return;
      
      const tileID = data[Math.floor(nextY / theight) * tmHeight + Math.floor(nextX/tWidth)] - 1;
      const tile = tileset.tiles.filter((tile) => tile.id === tileID)[0];
  
      if (tile && tile.properties.some(({ name, value }) => (name === 'collision' && value))) {
        entity.posX = 0;
        entity.posY = 0;
        return;
      }
    });
  };
  
  private renderLayer = (context, tilemap, tileset, layer, image) => {
    const { data: tiles } = layer;
    const { columns, spacing = 0 } = tileset;
    const { tileheight, tilewidth } = tilemap;
    const { x: xOffset, y: yOffset} = this.state.camera.state;
  
    if (!layer.visible) return;
  
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
          context.fillStyle = 'red';
          context.fillRect(posX, posY, width, height);
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

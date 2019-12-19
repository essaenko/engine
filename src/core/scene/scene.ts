import { AssetManager } from 'core/asset-manager';
import {ICamera} from 'core/camera/camera';

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
  
  private renderMap = (context: CanvasRenderingContext2D, xOffset: number = 0, yOffset: number = 0, width: number = 0, height: number = 0) => {
    const { map: { tileset, tilemap, atlas } } = this.state;
    const { image } = this.assets.getTilemap(atlas);
    const { layers, tileheight, tilewidth } = tilemap;
    const { columns } = tileset;

    layers.forEach((layer) => {
      const { data: tiles } = layer;

      for(let col = 0; col < layer.width; col++) {
        for(let row = 0; row < layer.height; row ++) {
          const tile = tiles[row * layer.width + col];
          context.drawImage(
            image,
            tilewidth * (tile - 1 - Math.floor(tile/columns) * 32),
            tileheight * Math.floor(tile/columns),
            tilewidth,
            tileheight,
            col * tilewidth + xOffset,
            row * tileheight + yOffset,
            tilewidth,
            tileheight,
          );
        }
      }
    });
  };

  public render = (context) => {
    const { width, height, map, camera } = this.state;

    if (!this.game.state.layer) {
      return void console.warn(`Can't render scene in game. Layer not defined. Use useLayer method of Game class to define it.`);
    }
    if (camera) {
      this.game.state.layer.height = camera.state.height;
      this.game.state.layer.width = camera.state.width;
      this.renderCamera(context);
    } else if (map) {
      this.renderMap(context);
    } else {
      context.fillStyle = this.state.fill;
      context.fillRect(0,0, width, height);
    }
    this.renderEntities(context);
  };
  
  private renderCamera = (context) => {
    const { camera } = this.state;
    this.renderMap(context, -camera.state.x, -camera.state.y);
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
          preventLoss,
          sprite,
          textContent,
          drawShape,
        } = entity.state;
  
        // if (preventLoss) {
        //   this.setEntityInToLayer(context);
        // }
  
        if (sprite) {
          sprite.render(context, {
            ...entity.state,
            posX: entity.state.posX - camera.state.x,
            posY: entity.state.posY - camera.state.y,
          });
        } else if (textContent) {
          textContent.forEach((textItem) => {
            const { content, x, y, font, color, id, width, height } = textItem;
            context.fillStyle = color;
            context.font = font;
            context.beginPath();
            context.rect(x,y, width, height);
            context.fillText(content, x, y + height);
            context.addHitRegion({id});
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
    this.entities.forEach((entity) => entity.init());
  };
  
  public useCamera = (camera: ICamera) => {
    const { height, tileheight, width, tilewidth } = this.state.map.tilemap;
    this.setState({ camera });
    camera.setState({ maxX: width * tilewidth - camera.state.width , maxY: height * tileheight - camera.state.height });
  };
  
  public destroy = () => {
    this.entities.forEach((entity) => {
      entity.destroy();
    })
  }
}

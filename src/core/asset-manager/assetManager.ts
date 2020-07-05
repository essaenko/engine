import { AssetLoader } from 'core/asset-manager/index';
import { SpriteSheet, ISpriteState } from 'core/assets/spritesheet/spritesheet';

export interface IDefaultAssetConfig {
  url: string;
}
export interface ISpriteAssetConfig extends IDefaultAssetConfig {
  width: number;
  height: number;
  col: number;
  row: number;
  xBorder?: number;
  yBorder?: number;
  xOffset?: number;
  yOffset?: number;
}

type AssetsTypes = 'sprites' | 'tilesets' | 'images' | 'sounds';

interface IAssetStore<AssetType, AssetConfigType>  {
  loaded: { [key: string]: AssetType },
  queue:  { [key: string]: AssetConfigType },
}
export class AssetManager {
  public loader: AssetLoader;
  public assets: {
    sprites: IAssetStore<ISpriteState, ISpriteAssetConfig>,
    tilesets: IAssetStore<any, IDefaultAssetConfig>,
    images: IAssetStore<HTMLImageElement, IDefaultAssetConfig>
    sounds: IAssetStore<string, string>,
  };

  constructor() {
    this.loader = new AssetLoader();
    this.assets = {
      sprites: {
        loaded: {},
        queue: {}
      },
      tilesets: {
        loaded: {},
        queue: {}
      },
      images: {
        loaded: {},
        queue: {}
      },
      sounds: {
        loaded: {},
        queue: {},
      }
    };
  }
  
  public getAsset = <T>(type: AssetsTypes, key: string): T => (this.assets[type].loaded[key] as T);
  public setAsset = (type: AssetsTypes, key: string, asset: SpriteSheet | {}): void => void (this.assets[type].loaded[key] = asset);
  
  public getSprite = (key: string): SpriteSheet => new SpriteSheet({ ...this.getAsset<ISpriteState>('sprites', key), name: key });
  public setSprite = (key: string, sprite: ISpriteState): void => this.setAsset('sprites', key, sprite);
  public addSprite = (key: string, config: ISpriteAssetConfig): void => void (this.assets.sprites.queue[key] = config);
  
  public getTileset = (key: string): any => this.getAsset<any>('tilesets', key);
  public setTileset = (key: string, map: any): void => this.setAsset('tilesets', key, map);
  public addTileset = (key: string, config: IDefaultAssetConfig): void => void (this.assets.tilesets.queue[key] = config);

  public getImage = (key: string): HTMLImageElement => this.getAsset<HTMLImageElement>('images', key);
  public setImage = (key: string, image: HTMLImageElement): void => this.setAsset('images', key, image);
  public addImage = (key: string, config: IDefaultAssetConfig): void => void (this.assets.images.queue[key] = config);
  
  public getSound = (key: string): string => this.getAsset<string>('sounds', key);
  public setSound = (key: string, url: string): void => this.setAsset('sounds', key, url);
  public addSound = (key: string, { url }: IDefaultAssetConfig): void => void (this.assets.sounds.loaded[key] = url);
  
  public load = async (): Promise<void> => {
    try {
      for (const type in this.assets) {
        if (this.assets.hasOwnProperty(type)) {
          for (const key in this.assets[type].queue) {
            if (this.assets[type].queue.hasOwnProperty(key)) {
              switch(type) {
                case 'sprites':
                  this.setSprite(key, {
                    ...this.assets[type].queue[key],
                    image: (await this.loader.sprite(this.assets[type].queue[key].url)),
                  });
                  delete this.assets[type].queue[key];
                  break;
                case 'tilesets':
                  this.setTileset(key, {
                    image: (await this.loader.sprite(this.assets[type].queue[key].url)),
                  });
                  break;
                case 'images':
                  this.setImage(key, (await this.loader.sprite(this.assets[type].queue[key].url)));
                  break;
              }
            }
          }
        }
      }
    } catch (error) {
      console.warn(error);
      throw new Error(`Failed to load resources: Error: ${error.message}`);
    }
  }
}

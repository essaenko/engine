import { AssetLoader } from 'core/asset-manager/index';
import {SpriteSheet} from 'core/assets/spritesheet/spritesheet';

export class AssetManager implements IAssetsManager {
  public loader;
  public assets;

  constructor() {
    this.loader = new AssetLoader();
    this.assets = {
      sprites: {
        loaded: {
        
        },
        queue: {
        
        }
      },
      tilemaps: {
        loaded: {
        
        },
        queue: {
        
        }
      }
    };
  }
  
  public getAsset = (type, key) => this.assets[type].loaded[key];
  public setAsset = (type, key, asset) => this.assets[type].loaded[key] = asset;
  
  public getSprite = (key) => this.getAsset('sprites', key);
  public setSprite = (key, image) => this.setAsset('sprites', key, image);
  
  public addSprite = (key, config) => this.assets.sprites.queue[key] = config;
  
  public getTilemap = (key) => this.getAsset('tilemaps', key);
  public setTilemap = (key, map) => this.setAsset('tilemaps', key, map);
  
  public addTileMap = (key, config) => this.assets.tilemaps.queue[key] = config;
  
  public load = async () => {
    try {
      for (const type in this.assets) {
        if (this.assets.hasOwnProperty(type)) {
          for (const key in this.assets[type].queue) {
            if (this.assets[type].queue.hasOwnProperty(key)) {
              switch(type) {
                case 'sprites':
                  this.setSprite(key, new SpriteSheet({
                    ...this.assets[type].queue[key],
                    image: (await this.loader.sprite(this.assets[type].queue[key].url)),
                  }));
                  delete this.assets[type].queue[key];
                  break;
                case 'tilemaps':
                  this.setTilemap(key, {
                    image: (await this.loader.sprite(this.assets[type].queue[key].url)),
                  });
                  break;
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn('Failed to load assets with error: ', e);
    }
  }
}

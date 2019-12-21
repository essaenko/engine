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
      tilesets: {
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
  
  public getTileset = (key) => this.getAsset('tilesets', key);
  
  public setTileset = (key, map) => this.setAsset('tilesets', key, map);
  public addTileset = (key, config) => this.assets.tilesets.queue[key] = config;
  
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
                case 'tilesets':
                  this.setTileset(key, {
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

import { AssetLoader } from 'core/asset-manager';

export class AssetManager {
  constructor() {
    this.load = new AssetLoader(this);
    this.assets = {
      sprites: {
      
      }
    };
  }
  
  getAsset = (type, key) => this.assets[type][key];
  setAsset = (type, key, asset) => this.assets[type][key] = asset;

  getSprite = (key) => this.getAsset('sprites', key);
  setSprite = (key, image) => this.setAsset('sprites', key, image);
}

export class AssetLoader {
  constructor(manager) {
    this.manager = manager;
  }
  
  loadAsset = async (url) => {
    const result = await fetch(`assets/${url}`);
    
    if (result.status === 200) {
     return await result.blob();
    } else {
      console.warn(`Failed loading asset with ${result.status} code`);
      return void 0;
    }
  };

  sprite = async (key, url) => {
    const asset = await this.loadAsset(url);
    
    if (asset) {
      this.manager.setSprite(key, asset);
    }
  }
}

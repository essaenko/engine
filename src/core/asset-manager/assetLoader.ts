export class AssetLoader {
  private loadAsset = async (url: string) => {
    const result = await fetch(`${url}`);
    
    if (result.status === 200) {
     return result;
    } else {
      console.warn(`Failed loading asset with ${result.status} code`);
      return void 0;
    }
  };
  
  private blobToImage = async (response: Response) => {
    const image = new Image();
    const blob = await response.blob();
    const imageLoading = new Promise((res, rej) => {
      image.onload = () => res(image);
      image.onerror = (e) => rej(e);
    });
    image.src = URL.createObjectURL(blob);
    
    return (await imageLoading);
  };

  public sprite = async (url) => (await this.blobToImage(await this.loadAsset(url)));
  
  public tilemap = async (url) => (await (await this.loadAsset(url)).json());
}

export class AssetLoader {
  private loadAsset = async (url: string): Promise<Response> => {
    const result: Response = await fetch(`${url}`);
    
    if (result.status === 200) {
     return result;
    } else {
      console.warn(`Failed loading asset with ${result.status} code`);
      return void 0;
    }
  };
  
  private blobToImage = async (response: Response): Promise<HTMLImageElement> => {
    const image: HTMLImageElement = new Image();
    const blob: Blob = await response.blob();
    const imageLoading: Promise<HTMLImageElement> = new Promise((res, rej) => {
      image.onload = () => res(image);
      image.onerror = (e) => rej(e);
    });
    image.src = URL.createObjectURL(blob);
    
    return (await imageLoading);
  };

  public sprite = async (url: string): Promise<HTMLImageElement> => (await this.blobToImage(await this.loadAsset(url)));
  
  public tilemap = async (url: string): Promise<any> => (await (await this.loadAsset(url)).json());
}

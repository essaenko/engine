import { AssetManager } from 'core/asset-manager';

export interface ISceneInitialState {

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
  
  private renderTailMap = () => {
  
  };

  public render = (context) => {
    const { width, height, map } = this.state;

    if (!this.game.state.layer) {
      return void console.warn(`Can't render scene in game. Layer not defined. Use useLayer of Game class to define it.`);
    }
    if (map) {
      this.renderTailMap();
    } else {
      context.fillStyle = this.state.fill;
      context.fillRect(0,0, width, height);
    }

    this.renderEntities(context);
  };
  
  renderEntities = (context) => {
    if (this.entities) {
      this.entities.forEach(entity => {
        entity.render(context);
      });
    }
  };
  
  usedByGame = async (game) => {
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
  
  useEntities = (entities) => {
    this.entities = entities;
    this.entities.forEach((entity) => entity.init());
  };
  
  public destroy = () => {
    this.entities.forEach((entity) => {
      entity.destroy();
    })
  }
}

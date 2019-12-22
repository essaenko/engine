declare interface IEventBus {
  subscribers: Dict<Array<() => void>>
  subscribe: (event: string, callback: (payload: any) => void) => void;
  dispatch: (event: string, payload: any) => void;
  unsubscribe: (event: string, handler: () => void) => void;
}

declare interface ILoop {
  eventBus: IEventBus;
  intervalId: number;
}

declare interface ISpriteConfig {
  width: number;
  height: number;
  url: string;
  col: number;
  row: number;
  xBorder?: number;
  yBorder?: number;
  xOffset?: number;
  yOffset?: number;
}

declare interface ITilesetConfig {
  url: string;
}

declare interface IAssetsManager {
  assets: {
    sprites: {
      loaded: Dict<ISpriteSheet>,
      queue: Dict<ISpriteSheetConfig>
    }
  };
  addSprite: (key: string, config: ISpriteConfig) => void;
  addTileset: (key: string, config: ITilesetConfig) => void;
}

declare interface ISpriteSheetConfig {

}

declare interface ISpriteSheet {

}

interface ISceneState {
  fill?: string;
  preload?: (IScene) => void;
  create?: (IScene) => void;
  update?: (IScene) => void;
  map?: {
    tileset: any,
    tilemap: any,
    atlas: string,
  },
  name?: string,
}

declare interface IScene {
  render: (context: CanvasRenderingContext2D) => void;
  usedByGame: (game: IGame) => void;
  state: ISceneState;
  assets: IAssetsManager;
  destroy: () => void;
}

interface IGameState {
  width?: number;
  height?: number;
  scene?: IScene;
  layerContext: CanvasRenderingContext2D;
  layer?: HTMLCanvasElement;
}

declare interface IGame {
  state: IGameState;
  useScene: (scene: IScene) => void;
  start: () => void;
}

declare interface MouseUIEvent extends MouseEvent {
  region: string;
}

declare interface Dict<T> {
  [key: string]: T,
}
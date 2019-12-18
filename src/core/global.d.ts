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

declare interface IAssetsManager {
  assets: {
    sprites: {
      loaded: Dict<ISpriteSheet>,
      queue: Dict<ISpriteSheetConfig>
    }
  }
}

declare interface ISpriteSheetConfig {

}

declare interface ISpriteSheet {

}

interface ISceneState {

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
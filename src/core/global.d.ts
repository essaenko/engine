declare interface IEventBus {
  subscribers: Dict<Array<(payload: any) => void>>
  dispatch: (event: string, payload: any) => void;
  subscribe: (event: string, callback: (payload: any) => void) => void;
  unsubscribe: (event: string, handler: (payload: any) => void) => void;
}

declare interface ILoop {
  eventBus: IEventBus;
  pressed: number[]
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

declare interface ISpriteState {
  xBorder?: number;
  xOffset?: number;
  yBorder?: number;
  yOffset?: number;
  row: number;
  col: number;
  width: number;
  height: number;
  image: HTMLImageElement;
  animation?: IAnimation | IAnimationGroup;
}

declare interface ISpriteSheet {
  state: ISpriteState;
}

declare interface IAnimation {
  getFrameNumber: () => number;
}

declare interface IAnimationGroup {
  state: Dict<IAnimation>
}

declare interface ITilesetConfig {
  url: string;
}

declare interface IAssetsManager {
  assets: {
    sprites: {
      loaded: Dict<ISpriteSheet>,
      queue: Dict<ISpriteConfig>
    }
  };
  addSprite: (key: string, config: ISpriteConfig) => void;
  addTileset: (key: string, config: ITilesetConfig) => void;
}

declare interface IGameInitialState {
  width?: number;
  height?: number;
  layer?: string;
  scene?: IScene;
}

declare interface IEntity {
  state: {
    posX: number;
    posY: number;
    scene: IScene;
    width: number;
    height: number;
    physics: {
      gravityX: number;
      gravityY: number;
    };
    following: {
      entity: IEntity,
      path: IPath,
      point: {
        x: number,
        y: number,
      }
    };
  };
  input: any;
  collisions: IEntity[];
  posX: number;
  posY: number;
  update: (event: any) => void;
}

declare interface ICamera {
  state: {
    follow: IEntity;
    width: number;
    height: number;
    x: number;
    y: number;
    maxX: number;
    maxY: number;
    scale?: number;
  };
  setState: (state: any) => void;
}

declare interface ISceneInitialState {
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

declare interface ISceneState {
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
  mapGraph?: IGraph,
}

declare interface IScene {
  render: (context: CanvasRenderingContext2D) => void;
  usedByGame: (game: IGame) => void;
  state: ISceneState;
  assets: IAssetsManager;
  destroy: () => void;
}

declare interface ICameraConfig {
  follow?: IEntity;
  width: number;
  height: number;
  scale?: number;
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

declare interface IPathFinder {
  find: (start: number[], end: number[], graph: IGraph) => any;
}

declare interface IPath {
  length: number,
  [key: number]: {
    x: number,
    y: number,
  }
}

declare interface IPathNode {
  x: number;
  y: number;
  cost: number;
}

declare interface IGraphConfig {
  width: number;
  height: number;
  map: number[];
}

declare interface IGraph {
  neighbors: (item: number[]) => IPathNode[];
  getNode: (item: number[]) => IPathNode;
}

declare interface IQueueConfig {

}

declare interface IQueue {
  put: (item: any, proirity?: number) => void;
  get: () => any;
  isEmpty: boolean;
  reset: () => void;
  length: number;
}

declare interface MouseUIEvent extends MouseEvent {
  region: string;
}

declare interface Dict<T> {
  [key: string]: T,
}
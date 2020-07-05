import { Core } from 'core/core';
import { Scene, SceneFactory } from 'core/scene';
import { IGameStartEvent, IGameSceneChangeEvent, ILoopTickEvent } from 'core/eventbus/events';
import { Sound } from 'core/sound';
import { AssetManager } from 'core/asset-manager';
import { IState as IStoreState } from 'core/store/store.types';
import { Store } from 'core/store';
import { IDefaultAssetConfig, ISpriteAssetConfig } from 'core/asset-manager/assetManager';

Math.clamp = (min: number, max: number, value: number) => Math.max(min, Math.min(value, max));
export interface IGameInitialState {
  width?: number;
  height?: number;
  layer?: string;
  store?: IStoreState,
  assets?: {
    images: Dict<IDefaultAssetConfig>,
    sprites: Dict<ISpriteAssetConfig>,
    tilesets: Dict<IDefaultAssetConfig>,
    sounds: Dict<IDefaultAssetConfig>,
  }
}
export class Game {
  public assetManager: AssetManager = new AssetManager();
  public store: Store;
  public state: {
    width?: number;
    height?: number;
    layer: HTMLCanvasElement;
    layerContext: CanvasRenderingContext2D;
    sound: Sound;
    scene: Scene;
  };

  constructor(props: IGameInitialState = {
    width: 600,
    height: 400,
    layer: 'app',
  }) {
    this.store = new Store(props.store);
    this.state = {
      width: props.width,
      height: props.height,
      layerContext: null,
      layer: document.getElementById(props.layer) as HTMLCanvasElement,
      sound: null,
      scene: SceneFactory(this.store, this.assetManager),
    };
    if (props.assets) {
      this.setAssetsQueue(props.assets);
    }
    (window as any).__game_state__ = this.state;
    this.awaitLoading();
  }

  public setAssetsQueue = (assets: IGameInitialState['assets']) => {
    for(const asset in assets) {
      for(const config in assets[asset]) {
        if (asset === 'sounds') {
          this.assetManager.assets[asset].loaded[config] = assets[asset][config].url;
        } else {
          this.assetManager.assets[asset].queue[config] = assets[asset][config];
        }
      }
    }
  }
  
  public setState = (state: { [K in keyof Game['state']]?: Game['state'][K] }): void => {
    this.state = {
      ...this.state,
      ...state,
    };
    (window as any).__game__ = this;
    (window as any).__game_state__ = this.state;
  };

  public getAssetManager = (): AssetManager => this.assetManager;

  private createSoundInterface = () => {
    this.setState({ sound: new Sound() });
  }
  
  private awaitLoading = async (): Promise<void> => {
    if (['complete', 'interactive'].includes(document.readyState)) {
      this.useLayer();
      this.createSoundInterface();
      await this.applyScene();
      this.start();
    } else {
      document.addEventListener('DOMContentLoaded', async (): Promise<void> => {
        this.useLayer();
        await this.applyScene();
        this.start();
      });
    }
    
  };
  
  public useScene = async (scene: Scene): Promise<void> => {
    Core.eventBus.unsubscribe<ILoopTickEvent>('loop:tick', this.render);
    if (this.state.scene) {
      this.state.scene.destroy();
    }
    this.setState({ scene });
    this.store.setState({ activeScene: scene.state.name });
    await this.applyScene();
    Core.eventBus.subscribe<ILoopTickEvent>('loop:tick', this.render);
    Core.eventBus.dispatch<IGameSceneChangeEvent>('game:scene:change', { scene });
  };
  
  private applyScene = async (): Promise<void> => {
    if (!(this.state.scene instanceof Scene)) {
      throw new Error('InitError: Provided scene must be instatce of Scene class');
    }
    await this.state.scene.usedByGame(this);
  };
  
  private useLayer = (): void => {
    const {
      state: {
        width,
        height,
        layer
      }
    } = this;
    if (typeof layer === 'object') {
      layer.width = width;
      layer.height = height;
  
      this.setState({
        layerContext: layer.getContext('2d'),
      });
    }
  };
  
  private render = (event: ILoopTickEvent): void => {
    const { layerContext, layer: { width, height }, scene } = this.state;

    layerContext.clearRect(0,0, width, height);
    
    scene.render(layerContext);
  };
  
  public start = (): void => {
    Core.eventBus.dispatch<IGameStartEvent>('game:start', { layer: this.state.layer });
    Core.eventBus.subscribe<ILoopTickEvent>('loop:tick', this.render);
  }

  public subscribe = Core.eventBus.subscribe;
  public unsubscribe = Core.eventBus.unsubscribe;
}

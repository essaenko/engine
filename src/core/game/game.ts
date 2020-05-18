import { Core } from 'core/core';
import { Scene } from 'core/scene';
import { IGameStartEvent, IGameInitedEvent, IGameSceneChangeEvent, ILoopTickEvent } from 'core/eventbus/events';
import { Sound } from 'core/sound';
import { AssetManager } from 'core/asset-manager';

window.Math.clamp = (min: number, max: number, value: number) => Math.max(min, Math.min(value, max));
export interface IGameInitialState {
  width?: number;
  height?: number;
  layer?: string;
  scene: Scene;
}
export class Game {
  public assetManager: AssetManager = new AssetManager();
  public state: {
    scene: Scene;
    width?: number;
    height?: number;
    layer: HTMLCanvasElement;
    layerContext: CanvasRenderingContext2D;
    sound: Sound;
  };

  constructor(initialState: IGameInitialState = {
    width: 600,
    height: 400,
    layer: 'app',
    scene: null,
  }) {
    this.state = { ...initialState, ...{
        layerContext: null,
        layer: document.getElementById(initialState.layer) as HTMLCanvasElement,
        sound: null,
      }
    };
    (window as any).__game_state__ = this.state;
    this.awaitLoading();
    Core.eventBus.dispatch<IGameInitedEvent>('game:inited');
  }
  
  public setState = (state: { [K in keyof Game['state']]?: Game['state'][K] }): void => {
    this.state = {
      ...this.state,
      ...state,
    };
    (window as any).__game_state__ = this.state;
  };

  public getAssetManager = (): AssetManager => this.assetManager;

  private createSoundInterface = () => {
    this.setState({ sound: new Sound() });
  }
  
  private awaitLoading = (): void => {
    if (['complete', 'interactive'].includes(document.readyState)) {
      this.useLayer();
      this.createSoundInterface();
      this.applyScene().then(() => {
        this.start();
      });
    } else {
      document.addEventListener('DOMContentLoaded',(): void => {
        this.useLayer();
        this.applyScene().then(() => {
          this.start();
        });
      });
    }
  };
  
  public useScene = (scene: Scene): void => {
    Core.eventBus.unsubscribe<ILoopTickEvent>('loop:tick', this.render);
    if (this.state.scene) {
      this.state.scene.destroy();
    }
    this.setState({ scene });
    this.applyScene().then(() => {
      Core.eventBus.subscribe<ILoopTickEvent>('loop:tick', this.render);
      Core.eventBus.dispatch<IGameSceneChangeEvent>('game:scene:change', { scene });
    });
  };
  
  private applyScene = async (): Promise<void> => {
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
    const { layerContext, layer: { width, height }, scene: { render } } = this.state;

    layerContext.clearRect(0,0, width, height);
    
    render(layerContext);
  };
  
  public start = (): void => {
    Core.eventBus.dispatch<IGameStartEvent>('game:start', { layer: this.state.layer });
    Core.eventBus.subscribe<ILoopTickEvent>('loop:tick', this.render);
  }

  public subscribe = Core.eventBus.subscribe;
  public unsubscribe = Core.eventBus.unsubscribe;
}

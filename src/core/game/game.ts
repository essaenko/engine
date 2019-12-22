import { Core } from 'core/core';

export interface IGameInitialState {
  width?: number;
  height?: number;
  layer?: string;
  scene?: IScene;
}

export class Game implements IGame {
  public state;

  constructor(initialState: IGameInitialState = {
    width: 600,
    height: 400,
    layer: 'app',
  }) {
    this.state = { ...initialState, ...{
        layerContext: null,
        layer: document.getElementById(initialState.layer) as HTMLCanvasElement
      }
    };
    (window as any).__game_state__ = this.state;
    this.awaitLoading();
    Core.eventBus.dispatch('game:inited');
  }
  
  private setState = (state): void => {
    this.state = {
      ...this.state,
      ...state,
    };
    (window as any).__game_state__ = this.state;
  };
  
  private awaitLoading = (): void => {
    if (['complete', 'interactive'].includes(document.readyState)) {
      this.useLayer();
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
  
  public useScene = (scene: IScene): void => {
    Core.eventBus.unsubscribe('loop:tick', this.render);
    if (this.state.scene) {
      this.state.scene.destroy();
    }
    this.setState({ scene });
    this.applyScene().then(() => {
      Core.eventBus.subscribe('loop:tick', this.render);
      Core.eventBus.dispatch('game:scene:change', { scene });
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
      layer.addEventListener('click', (event: MouseUIEvent): void =>  {
        Core.eventBus.dispatch(`canvasClick`, event);
      });
    }
  };
  
  private render = (): void => {
    const { layerContext, layer: { width, height }, scene: { render } } = this.state;

    layerContext.clearRect(0,0, width, height);
    
    render(layerContext);
  };
  
  public start = (): void => {
    Core.eventBus.dispatch('game:start');
    Core.eventBus.subscribe('loop:tick', this.render);
  }

  public subscribe = Core.eventBus.subscribe;
  public unsubscribe = Core.eventBus.unsubscribe;
}

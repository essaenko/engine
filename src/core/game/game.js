import {Core} from 'core/core';

export class Game {
  constructor(initialState = {
    width: 600,
    height: 400,
    layer: 'app',
  }) {
    this.state = { ...initialState };
    this.scene = initialState.scene;
    this.awaitLoading();

    Core.eventBus.dispatch('game:inited');
  }
  
  awaitLoading = () => {
    document.addEventListener('DOMContentLoaded', () => {
      this.useLayer();
      this.applyScene();
      this.start();
    });
  };
  
  applyScene = () => {
    this.scene.usedByGame(this);
    this.scene.render(this.layerContext);
  };
  
  useLayer = () => {
    this.layer = document.getElementById(this.state.layer);
    const { layer, state: {
      width,
      height
    } } = this;
    layer.width = width;
    layer.height = height;
    this.layerContext = layer.getContext('2d');
  };
  
  render = () => {
    this.layerContext.clearRect(0,0, this.layer.width, this.layer.height);
    
    this.scene.render(this.layerContext);
  };
  
  start() {
    Core.eventBus.dispatch('game:start');
    Core.eventBus.subscribe('loop:tick', this.render);
  }
}

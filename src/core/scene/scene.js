import {Core} from 'core/core';
import { AssetManager } from 'core/asset-manager';

export class Scene {
  constructor(initialState = {}) {
    this.state = {...initialState};
    this.assets = new AssetManager();
  }

  render = (context) => {
    if (!this.game.layer) {
      return void console.warn(`Can't render scene in game. Layer not defined. Use useLayer of Game class to define it.`);
    }
    context.fillStyle = this.state.fill;
    context.fillRect(0,0, this.game.state.width, this.game.state.height);

    this.renderEntities(context);
  };
  
  renderEntities = (context) => {
    this.entities.forEach(entity => {
      entity.render(context);
    });
  };
  
  usedByGame = (game) => {
    this.game = game;
    this.state.preload(this);
    this.state.create(this);
  };
  
  useEntities = (entities) => {
    this.entities = entities;
  }
}

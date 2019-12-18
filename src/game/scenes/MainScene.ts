import { Core } from 'core/core';
import { Scene } from 'core/scene';
import { Menu } from 'game/entities/menu';

import { GameScene } from './GameScene';

export const MainScene = new Scene({
  fill: '#fff',
  preload: (scene) => {
  
  },
  create: (scene) => {
    const menu = new Menu({
      textContent: [
        {
          content: 'Новая игра',
          x: 50,
          y: 50,
          font: '20px Arial',
          color: '#000',
          id: 'StartGame',
          width: 150,
          height: 20,
        }
      ]
    });
    
    scene.useEntities([
      menu,
    ]);

    Core.eventBus.subscribe('clickRegionStartGame', () => {
      scene.game.useScene(GameScene);
    });
  }
});

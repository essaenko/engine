import { MainScene } from 'game/scenes';
import { Game } from 'core/game';
import { GameMenu } from './js';

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game({
    width: window.innerWidth,
    height: window.innerHeight,
    scene: MainScene,
    layer: 'layer',
  });
  game.subscribe('game:scene:change', (event) => {
    if (event.scene.state.name === 'GameScene') {
      GameMenu();
    }
  });
});

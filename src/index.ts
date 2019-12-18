import { MainScene } from 'game/scenes';
import { Game } from 'core/game';

document.addEventListener('DOMContentLoaded', () => {
  new Game({
    width: window.innerWidth,
    height: window.innerHeight,
    scene: MainScene,
    layer: 'layer',
  });
});

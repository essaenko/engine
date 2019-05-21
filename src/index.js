import { Game } from 'core';
import { DefaultScene } from 'game/scenes';

const game = new Game({
  width: 600,
  height: 400,
  scene: DefaultScene,
  layer: 'layer',
});

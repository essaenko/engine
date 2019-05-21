import { Scene } from 'core/scene';
import {Player} from 'game/entities/player';
import {Ground} from 'game/entities/ground';

export const DefaultScene = new Scene({
  fill: '#e7e7e7',
  preload: (scene) => {
    scene.assets.load.sprite('playerSprite', 'player.png');
  },
  create: (scene) => {
    console.log(scene.assets.getAsset('sprites', 'playerSprite'));
    const player = new Player({
      width: 10,
      height: 10,
      posX: 10,
      posY: 10,
      fill: 'black',
      physics: {
        gravityY: 0,
        gravityX: 0,
      },
      sprite: scene.assets.getSprite('playerSprite'),
    });
  
    const ground = new Ground({
      width: 300,
      height: 20,
      posX: 0,
      posY: 100,
      fill: '#fff',
    });
  
    player.setCollision(ground);
  
    scene.useEntities([
      ground,
      player,
    ]);
  }
});

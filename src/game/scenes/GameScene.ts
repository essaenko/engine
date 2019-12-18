import { Scene } from 'core/scene';
import { AnimationGroup, Animation } from 'core/assets/animation';

import {Ground, Player, Fps} from 'game/entities';
// @ts-ignore
import knightSprite from 'game/assets/knight.png';
// @ts-ignore
import athlas from 'game/assets/athlas.png';

export const GameScene = new Scene({
  fill: '#000',
  preload: (scene) => {
    scene.assets.addSprite('grunt', {
      width: 75,
      height: 103.75,
      url: knightSprite,
      col: 4,
      row: 12,
    });
    scene.assets.addTileMap('athlas', {
      url: athlas,
    });
  },
  create: (scene) => {
    const fpsMeter = new Fps({
      textContent: [{
        width: 20,
        height: 20,
        y: 10,
        x: 10,
        color: '#fff',
        font: '20px Arial',
        id: 'fps_meter',
        content: 0,
      }]
    });
    const playerAnimation = new AnimationGroup({
      top: new Animation({
        frames: [36,37,38],
        speed: 3,
      }),
      left: new Animation({
        frames: [12,13,14],
        speed: 3,
      }),
      right: new Animation({
        frames: [24,25,26],
        speed: 3,
      }),
      down: new Animation({
        frames: [0,1,2],
        speed: 3,
      })
    });
    const playerSprite = scene.assets.getSprite('grunt');
    playerSprite.useAnimation(playerAnimation);
    const platform = new Ground({
      width: 100,
      height: 20,
      posX: 50,
      posY: 100,
      fill: 'white',
    });
    const player = new Player({
      width: 32,
      height: 20,
      posX: 10,
      posY: 30,
      fill: 'white',
      preventLoss: true,
      physics: {
        gravityY: 0,
        gravityX: 0,
      },
      sprite: playerSprite,
      scaleHeight: 30,
    });
    player.setCollision(platform);
    
    scene.useEntities([
      platform,
      player,
      fpsMeter,
    ])
  }
});

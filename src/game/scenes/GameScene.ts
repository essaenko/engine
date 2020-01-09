import { Scene } from 'core/scene';
import { AnimationGroup, Animation } from 'core/assets/animation';
import { Camera } from 'core/camera';

import * as tilemap from 'game/levels/defaultScene.json';
import { createAnimation } from 'game/animations/animations.factory';

import {Enimy, Player, Fps} from 'game/entities';
// @ts-ignore
import playerSprite from 'game/assets/player.png';
// @ts-ignore
import rogueSprite from 'game/assets/rogue.png';
// @ts-ignore
import atlas from 'game/assets/summer_atlas.png';

export const GameScene = new Scene({
  fill: '#000',
  name: 'GameScene',
  map: {
    tileset: tilemap.tilesets[0],
    tilemap,
    atlas: 'atlas',
  },
  preload: (scene: IScene) => {
    scene.assets.addSprite('player', {
      width: 64,
      height: 64,
      url: playerSprite,
      col: 13,
      row: 21
    });
    scene.assets.addSprite('rogue', {
      width: 64,
      height: 64,
      url: rogueSprite,
      col: 13,
      row: 21
    });
    scene.assets.addTileset('atlas', {
      url: atlas,
    });
  },
  create: (scene) => {
    const playerSprite = scene.assets.getSprite('player');
    const rogueSprite = scene.assets.getSprite('rogue');
    rogueSprite.useAnimation(createAnimation());
    playerSprite.useAnimation(createAnimation());
    const fpsMeter = new Fps({
      textContent: [{
        width: 10,
        height: 10,
        y: 5,
        x: 5,
        color: '#0fff',
        font: '10px Arial',
        id: 'fps_meter',
        content: 0,
      }]
    });
    const player = new Player({
      width: 15,
      height: 10,
      posX: 230,
      posY: 350,
      fill: 'white',
      preventLoss: true,
      physics: {
        gravityY: 0,
        gravityX: 0,
      },
      sprite: playerSprite,
      scaleHeight: 31,
      scaleWidth: 26,
    });
  
    const rogue = new Enimy({
      width: 15,
      height: 10,
      posX: 500,
      posY: 350,
      fill: 'white',
      preventLoss: true,
      physics: {
        gravityY: 0,
        gravityX: 0,
      },
      sprite: rogueSprite,
      scaleHeight: 31,
      scaleWidth: 26,
      actions: {
        aggro: {
          distance: 200,
          spawn: {
            x: 500,
            y: 350,
          }
        }, 
      },
    });
    player.setCollision(rogue);
    rogue.setCollision(player);
    
    scene.useEntities([
      player,
      rogue,
      fpsMeter,
    ]);
    scene.useCamera(new Camera({
      follow: player,
      width: Math.round(window.innerWidth * 0.75/1.7),
      height: Math.round(window.innerHeight/1.7),
      scale: 1.7,
    }));
  }
});

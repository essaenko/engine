import { Scene } from 'core/scene';
import { AnimationGroup, Animation } from 'core/assets/animation';
import { Camera } from 'core/camera';

import {Ground, Player, Fps} from 'game/entities';
// @ts-ignore
import footmanSprite from 'game/assets/footman.png';
// @ts-ignore
import atlas from 'game/assets/summer_atlas.png';
import * as tilemap from 'game/levels/defaultScene.json';

export const GameScene = new Scene({
  fill: '#000',
  map: {
    tileset: tilemap.tilesets[0],
    tilemap,
    atlas: 'atlas',
  },
  preload: (scene) => {
    scene.assets.addSprite('footman', {
      width: 64,
      height: 64,
      url: footmanSprite,
      col: 13,
      row: 21,
    });
    scene.assets.addTileset('atlas', {
      url: atlas,
    });
  },
  create: (scene) => {
    const { map: { tilemap } } = scene.state;
    const mapWidth = tilemap.width * tilemap.tilewidth;
    const mapHeight = tilemap.height * tilemap.tileheight;
    const fpsMeter = new Fps({
      textContent: [{
        width: 20,
        height: 20,
        y: 10,
        x: 10,
        color: '#000',
        font: '20px Arial',
        id: 'fps_meter',
        content: 0,
      }]
    });
    const playerAnimation = new AnimationGroup({
      top: new Animation({
        frames: [[0,8], [1,8], [2,8], [3,8], [4,8], [5,8], [6,8], [7,8], [8,8]],
        speed: 2,
      }),
      left: new Animation({
        frames: [[0,9], [1,9], [2,9], [3,9], [4,9], [5,9], [6,9], [7,9], [8,9]],
        speed: 2,
      }),
      right: new Animation({
        frames: [[0,11], [1,11], [2,11], [3,11], [4,11], [5,11], [6,11], [7,11], [8,11]],
        speed: 2,
      }),
      down: new Animation({
        frames: [[0,10], [1,10], [2,10], [3,10], [4,10], [5,10], [6,10], [7,10], [8,10]],
        speed: 2,
      })
    });
    const playerSprite = scene.assets.getSprite('footman');
    playerSprite.useAnimation(playerAnimation);
    const player = new Player({
      width: 22,
      height: 22,
      posX: 230,
      posY: 350,
      fill: 'white',
      preventLoss: true,
      physics: {
        gravityY: 0,
        gravityX: 0,
      },
      sprite: playerSprite,
      scaleHeight: 10,
      scaleWidth: 10,
    });
    
    scene.useEntities([
      player,
      fpsMeter,
    ]);
    scene.useCamera(new Camera({
      follow: player,
      width: 850,
      height: 605,
      scale: 1.7,
    }));
  }
});

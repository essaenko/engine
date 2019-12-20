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
    scene.assets.addTileMap('atlas', {
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
        frames: [105, 106, 107, 108, 109, 110, 111, 112, 113],
        speed: 1,
      }),
      left: new Animation({
        frames: [126, 127, 128, 129, 130, 131, 132, 133, 134, 135],
        speed: 1,
      }),
      right: new Animation({
        frames: [131, 132, 133, 134, 135, 136, 137, 138, 139],
        speed: 1,
      }),
      down: new Animation({
        frames: [122, 123, 124, 125, 126, 127, 128, 129, 130],
        speed: 1,
      })
    });
    const playerSprite = scene.assets.getSprite('footman');
    playerSprite.useAnimation(playerAnimation);
    const player = new Player({
      width: 32,
      height: 32,
      posX: 210,
      posY: 210,
      fill: 'white',
      preventLoss: true,
      physics: {
        gravityY: 0,
        gravityX: 0,
      },
      sprite: playerSprite,
    });
    
    scene.useEntities([
      player,
      fpsMeter,
    ]);
    scene.useCamera(new Camera({
      follow: player,
      width: window.innerWidth > mapWidth ? mapWidth : window.innerWidth,
      height: window.innerHeight > mapHeight ? mapHeight : window.innerHeight,
    }));
  }
});

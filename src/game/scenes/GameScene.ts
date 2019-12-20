import { Scene } from 'core/scene';
import { AnimationGroup, Animation } from 'core/assets/animation';
import { Camera } from 'core/camera';

import {Ground, Player, Fps} from 'game/entities';
// @ts-ignore
import knightSprite from 'game/assets/knight.png';
// @ts-ignore
import atlas from 'game/assets/atlas.png';
import * as tilemap from 'game/levels/gameScene.json';
import * as tileset from 'game/assets/atlas.json';

export const GameScene = new Scene({
  fill: '#000',
  map: {
    tileset,
    tilemap,
    atlas: 'atlas',
  },
  preload: (scene) => {
    scene.assets.addSprite('grunt', {
      width: 75,
      height: 103.75,
      url: knightSprite,
      col: 4,
      row: 12,
    });
    scene.assets.addTileMap('atlas', {
      url: atlas,
    });
  },
  create: (scene) => {
    const { map: { tilemap, tileset } } = scene.state;
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
    const player = new Player({
      width: 32,
      height: 20,
      posX: 70,
      posY: 90,
      fill: 'white',
      preventLoss: true,
      physics: {
        gravityY: 0,
        gravityX: 0,
      },
      sprite: playerSprite,
      scaleHeight: 30,
    });
    
    scene.useEntities([
      player,
      fpsMeter,
    ]);
    scene.useCamera(new Camera({
      follow: player,
      width: window.innerWidth > mapWidth ? mapWidth : window.innerWidth,
      height: window.innerHeight > mapHeight ? mapHeight : window.innerHeight,
    }))
  }
});

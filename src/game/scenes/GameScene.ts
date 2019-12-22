import { Scene } from 'core/scene';
import { AnimationGroup, Animation } from 'core/assets/animation';
import { Camera } from 'core/camera';

import * as tilemap from 'game/levels/defaultScene.json';
import { playerAnimation } from 'game/animations/animations.player';

import {Ground, Player, Fps} from 'game/entities';
// @ts-ignore
import footmanSprite from 'game/assets/footman.png';
// @ts-ignore
import atlas from 'game/assets/summer_atlas.png';

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

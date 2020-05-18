import { Scene } from 'core/scene';
import { Camera } from 'core/camera';
import { SpriteSheet } from 'core/assets/spritesheet';

import { store } from 'js/store/store';

import * as tilemap from 'game/levels/defaultScene.json';
import { createAnimation } from 'game/animations/animations.factory';

import { Enimy, Player, Fps, StatusBar } from 'game/entities';
// @ts-ignore
import playerSprite from 'game/assets/images/player.png';
// @ts-ignore
import rogueSprite from 'game/assets/images/rogue.png';
// @ts-ignore
import atlas from 'game/assets/images/summer_atlas.png';
// @ts-ignore
import hood from 'game/assets/images/hood.png';
// @ts-ignore
import stepSound from 'game/assets/sounds/step.ogg';
// @ts-ignore
import slashSound from 'game/assets/sounds/slash.wav';
// @ts-ignore
import deathSound from 'game/assets/sounds/death.mp3';
// @ts-ignore
import levelUpSound from 'game/assets/sounds/levelup.mp3';

import { playBackgroundMusic } from 'game/utils/sounds';

export const GameScene = new Scene({
  fill: '#000',
  name: 'GameScene',
  title: 'gamescene',
  map: {
    tileset: tilemap.tilesets[0],
    tilemap: {
      ...tilemap,
    },
    atlas: 'atlas',
  },
  graph: {
    allowDiagonals: true,
  },
  preload: (scene: Scene) => {
    scene.assets.addSprite('player', {
      width: 64,
      height: 64,
      url: playerSprite,
      col: 12,
      row: 8
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
    scene.assets.addImage('hood', {
      url: hood,
    });
    scene.assets.addSound('step', {
      url: stepSound,
    });
    scene.assets.addSound('slash', {
      url: slashSound,
    });
    scene.assets.addSound('death', {
      url: deathSound,
    });
    scene.assets.addSound('levelup', {
      url: levelUpSound,
    })
  },
  create: (scene: Scene) => {
    const playerSprite: SpriteSheet = scene.assets.getSprite('player');
    const rogueSprite: SpriteSheet = scene.assets.getSprite('rogue');
    rogueSprite.useAnimation(createAnimation());
    playerSprite.useAnimation(createAnimation());
    const fpsMeter = new Fps({
      posX: 5,
      posY: 5,
      width: 10,
      height: 10,
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
      stats: {
        ...store.player.stats,
        armor: 5,
      },
      level: store.player.level,
      class: store.player.class,
      expirience: store.player.expirience,
      title: "player",
      speed: 2,
      width: 10,
      height: 16,
      posX: 250,
      posY: 350,
      fill: 'white',
      physics: {
        gravityY: 0,
        gravityX: 0,
      },
      sprite: playerSprite,
      scale: {
        x: 22,
        y: 16,
      }
    });
  
    const rogue = new Enimy({
      width: 10,
      height: 16,
      posX: 500,
      posY: 350,
      speed: 2,
      fill: 'white',
      physics: {
        gravityY: 0,
        gravityX: 0,
      },
      sprite: rogueSprite,
      actions: {
        aggro: {
          distance: 100,
          spawn: {
            x: 500,
            y: 350,
          }
        }, 
      },
      scale: {
        x: 22,
        y: 16,
      },
      class: 'hunter',
      expirience: 0,
      level: 2,
      stats: {
        agile: 10,
        strenght: 5,
        intellegence: 5,
        health: 100,
        mana: 100,
        armor: 2,
      }
      
    });
    const statusBar = new StatusBar({
      title: "statusbar",
      posX: 10,
      posY: 10,
      width: 120,
      height: 15,
      fill: 'rgb(255,255,255)',
    })
    player.setCollision(rogue);
    rogue.setCollision(player);

    scene.useCamera(new Camera({
      follow: player,
      width: Math.round(window.innerWidth),
      height: Math.round(window.innerHeight),
      scale: 2,
    }));
    
    scene.useEntities([
      player,
      rogue,
      fpsMeter,
      statusBar,
    ]);

    playBackgroundMusic(scene.game);
  }
});

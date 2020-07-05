import { Store } from 'core/store';
import { Scene } from './scene';
import { AssetManager } from 'core/asset-manager';
import { Map } from 'core/map';
import { levels } from 'game/levels';
import { entities } from 'game/utils/entityMap';
import { SpriteSheet } from 'core/assets/spritesheet';
import { createActionAnimation } from 'game/animations/actions.factory';
import { Player } from 'game/entities';
import { Camera } from 'core/camera';
import { createEffectAnimation } from 'game/animations/effects.factory';
import { Animation } from 'core/assets/animation';
import { playBackgroundMusic } from 'game/utils/sounds';

export const SceneFactory = (store: Store, assets: AssetManager): Scene => {
  return new Scene({
    fill: store.scene.fill,
    map: new Map({
      tilemap: levels[store.scene.map],
      graph: {
        allowDiagonals: true,
      }
    }),
    name: store.scene.name,
    create: (scene: Scene) => {
      assets.getSprite('effects').useAnimation(createEffectAnimation());
      console.log(store);
      store.scene.entities.forEach((entity) => {
        let sprite: SpriteSheet;
        if (entity.sprite && entity.class) {
          sprite = assets.getSprite(entity.sprite);
          sprite.useAnimation(createActionAnimation());
        }
        if (entity.title === 'cladbone') {
          sprite = assets.getSprite(entity.sprite);
          sprite.useAnimation(new Animation({
            frames: [[0, 6]],
            speed: 1,
          }));
        }
        const instance = new entities[entity.title]({
          ...entity as any,
          sprite,
        });
        scene.useEntities([instance]);
        if (instance instanceof Player) {
          scene.useCamera(new Camera({
            width: window.innerWidth * 0.75,
            height: window.innerHeight,
            scale: 2,
            follow: instance,
          }));
        }
      });
      playBackgroundMusic(scene.game);
    }
  })
}
import * as React from 'react';

import { Game } from "core/game";

// @ts-ignore
import playerSprite from 'game/assets/images/player.png';
// @ts-ignore
import rogueSprite from 'game/assets/images/rogue.png';
// @ts-ignore
import atlas from 'game/assets/images/summer_atlas.png';
// @ts-ignore
import cladbone from 'game/assets/images/cladbone.png';
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
// @ts-ignore
import effectsSprite from 'game/assets/images/effects.png';

import { GameHood } from 'js/interface/hood';

export const GameLayout = ({ state, setState }) => {
  const canvas = React.useRef(null);
  const { player, characters } = state;

  React.useEffect(() => {
    if (canvas.current !== null) {
      setState({
        ...state,
        game: new Game({
          width: window.innerWidth,
          height: window.innerHeight,
          assets: {
            sprites: {
              player: {
                width: 64,
                height: 64,
                url: playerSprite,
                col: 12,
                row: 8
              },
              effects: {
                width: 192,
                height: 192,
                url: effectsSprite,
                col: 5,
                row: 8
              },
              rogue: {
                width: 64,
                height: 64,
                url: rogueSprite,
                col: 13,
                row: 21
              },
              cladbone: {
                width: 32,
                height: 32,
                url: cladbone,
                col: 16,
                row: 16
              }
            },
            tilesets: {
              summer_atlas: { url: atlas },
            },
            images: {
              hood: { url: hood },
            },
            sounds: {
              step: { url: stepSound },
              slash: { url: slashSound },
              death: { url: deathSound },
              levelup: { url: levelUpSound },
            }
          },
          store: characters[player.class][player.name],
          layer: 'layer',
        })
    });
    }
  }, [canvas]);

  return (<>
    <canvas id='layer' ref={canvas}></canvas>
    <GameHood state={state}  />  
  </>)
}
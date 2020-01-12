import * as React from 'react';

import GameHood from './GameHood';

import { GameScene } from "game/scenes";
import { Game } from "core/game";

const GameLayout = ({ store, setState }) => {
  const canvas = React.useRef(null);
  React.useEffect(() => {
    if (canvas.current !== null) {
      new Game({
        width: window.innerWidth,
        height: window.innerHeight,
        scene: GameScene,
        layer: 'layer',
      });
    }
  }, [canvas]);

  return (<>
    <canvas id='layer' ref={canvas}>

    </canvas>
    <GameHood setState={setState}/>
  </>)
}

export default GameLayout;
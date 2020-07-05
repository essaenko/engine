import * as React from 'react';

import { GameHoodCharacter } from './GameHoodCharacter';

export const GameHood = ({ state }) => {
  const [player, setPlayer] = React.useState(null);
  const [menu, setMenu] = React.useState('main');
  const { game } = state;
  const getPlayerState = () => {
    if (!player) {
      const player = game?.state.scene.getEntityByProperty('title', 'player');
      if (player) {
        player.onSetState = setPlayer;
      } else {
        requestAnimationFrame(getPlayerState);
      }
    }
  }
  getPlayerState();
  
  const exitGame = () => {
    saveGame();
    location.reload();
  }

  const saveGame = () => {
    const savedData = JSON.parse(localStorage.getItem('game_store'));
    if (!savedData.characters[player.class]) {
      savedData.characters[player.class] = {};
    }
    savedData.characters[player.class][player.name] = game.store.state;
    localStorage.setItem('game_store', JSON.stringify(savedData));
  }

  return (
    <div className='game_hood'>
      <div className="hood__tabs">
        <div className="hood__tab" onClick={() => setMenu('main')}>
          Персонаж
        </div>
        <div className="hood__tab"  onClick={() => setMenu('quests')}>
          Задания
        </div>
      </div>
      {menu === 'main' && <GameHoodCharacter player={player} />}
      <div className='hood__btns-w'>
        <div className='hood__btn hood__btn_exit' onClick={() => saveGame()}>
          Сохранить
        </div>
        <div className='hood__btn hood__btn_exit' onClick={() => exitGame()}>
          Выход
        </div>
      </div>
    </div>
  );
}
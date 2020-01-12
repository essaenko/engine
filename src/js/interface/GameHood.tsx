import * as React from 'react';
import { inject, observer } from 'mobx-react';

const GameHood = ({ store, setState }) => {
  const exitGame = () => {
    location.reload();
  }
  return (
    <div className='game_hood'>
      <div className='hood__btn hood__btn_exit' onClick={() => exitGame()}>
        Выход
      </div>
    </div>
  );
}

export default inject('store')(observer(GameHood));
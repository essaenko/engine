import * as React from 'react';
import { useState, useEffect } from 'react';

import { MainMenu } from './MainMenu';
import { CharacterPicker } from './CharacterPicker';
import { CharacterCreator } from './CharacterCreator';
import { GameLayout } from './GameLayout';

const savedData = localStorage.getItem('game_store');

export const App = () => {
  const [state, setState] = useState({
    character: {},
    characters: [],
    menu: 'main',
  });

  useEffect(() => {
    setState({ ...state, ...JSON.parse(savedData), menu: 'main' });
  }, []);
  
  return (
    <div>
      {state.menu !== 'game' &&
        <div className='main_menu'>
          {state.menu === 'main' && (<MainMenu setState={setState} state={state} />)}
          {state.menu === 'characters' && (<CharacterPicker setState={setState} state={state} />)}
          {state.menu === 'character' && (<CharacterCreator setState={setState} state={state} />)}
        </div>
      }
      {state.menu === 'game' && (<GameLayout state={state} setState={setState} />)}
    </div>
  )
}
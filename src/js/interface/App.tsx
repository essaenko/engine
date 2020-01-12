import * as React from 'react';
import { Provider } from 'mobx-react';

import { store } from 'js/store/store'; 

import { MainMenu } from './MainMenu';
import CharacterPicker from './CharacterPicker';
import CharacterCreator from './CharacterCreator';
import GameLayout from './GameLayout';
// import { CharacterPicker } from '../characterpicker';

export const App = () => {
  const [state, setState] = React.useState({ menu: 'main' });
  
  return (
    <Provider store={store}>
      {state.menu !== 'game' && <div className='main_menu'>
        {state.menu === 'main' && (<MainMenu setState={setState} />)}
        {state.menu === 'characters' && (<CharacterPicker  setState={setState} />)}
        {state.menu === 'character' && (<CharacterCreator  setState={setState} />)}
      </div>}
      {state.menu === 'game' && (<GameLayout setState={setState} />)}
    </Provider> 
  );
}
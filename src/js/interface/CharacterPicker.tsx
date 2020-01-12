import * as React from 'react';
import { inject, observer } from 'mobx-react';
// import { store } from './store';
// import { CharacterCreator } from './charactercreator';
// import { MainMenu } from './interface/App';
// import { GameInit } from './gameinit';

interface IProps {
  setState: (state: any) => void;
  store: {
    characters: any[];
    player: any;
  };
}

const CharacterPicker = ({ setState, store }: IProps) => {
  const { characters } = store;
  
  return (
    <div className='character_picker'>
      {characters.reduce((acc, char) => {
        acc.push(
        <div className='character_item' onClick={() => {
          store.player = char;
          setState({ menu: 'game' });
        }} key={char.class+char.name}>
          <span className='character_item__name'>
            {char.name}
          </span>
          <span className='character_item__info'>
            {char.class} Ур. {char.level}
          </span>
        </div>);

        return acc;
      }, [])}
      <div className='character_item' onClick={() => setState({ menu: 'character' })}>
        Новый персонаж
      </div>
      <div className='character_item' onClick={() => setState({ menu: 'main' })}>
        Назад
      </div>
    </div>);
};

export default inject('store')(observer(CharacterPicker));
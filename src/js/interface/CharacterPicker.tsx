import * as React from 'react';
import { useContext } from 'react';

export const CharacterPicker = ({ state, setState }) => {
  const { characters } = state;
  let characterList: React.ReactElement[] = [];
  
  for (const classKey in characters) {
    if (characters.hasOwnProperty(classKey)) {
      for (const nameKey in characters[classKey]) {
        if (characters[classKey].hasOwnProperty(nameKey)) {
          const char = characters[classKey][nameKey].player;
          characterList.push(
            <div className='character_item' onClick={() => {
              setState({ ...state, menu: 'game', player: char });
            }} key={char.class+char.name}>
              <span className='character_item__name'>
                {char.name}
              </span>
              <span className='character_item__info'>
                {char.class} Ур. {char.level}
              </span>
            </div>
          )
        }
      }
    }
  }
  
  return (
    <div className='character_picker'>
      {characterList}
      <div className='character_item' onClick={() => setState({ ...state, menu: 'character' })}>
        Новый персонаж
      </div>
      <div className='character_item' onClick={() => setState({ ...state, menu: 'main' })}>
        Назад
      </div>
    </div>);
};
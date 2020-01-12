import * as React from 'react';
import { inject, observer } from 'mobx-react';

const CharacterCreator = ({ store, setState }) => {
  let { character, characters } = store;
  
  const saveCharactor = () => {
    character.stats = classes[character.class].stats;
    character.level = 1;
    characters.push(character);
    character = {};
    localStorage.setItem('game_store', JSON.stringify(store));
    setState({ menu: 'characters' });
  }

  const classes = {
    warrior: {
      stats: {
        intellegence: 5,
        strenght: 10,
        agile: 6,
      }
    },
    mage: {
      stats: {
        intellegence: 10,
        strenght: 5,
        agile: 5,
      }
    },
    druid: {
      stats: {
        intellegence: 5,
        strenght: 7,
        agile: 7,
      }
    },
    hunter: {
      stats: {
        intellegence: 5,
        strenght: 5,
        agile: 10,
      }
    }
  }
  
  return (
    <div className='character_creator'>
      <div className='character_creator__classes'>
        <div className={`character_creator__class ${character.class === 'warrior' && 'character_creator__class_active'}`} onClick={() => character.class = 'warrior'}>
          Воин
        </div>
        <div className={`character_creator__class ${character.class === 'mage' && 'character_creator__class_active'}`} onClick={() => character.class = 'mage'}>
          Маг
        </div>
        <div className={`character_creator__class ${character.class === 'hunter' && 'character_creator__class_active'}`} onClick={() => character.class = 'hunter'}>
          Охотник
        </div>
        <div className={`character_creator__class ${character.class === 'druid' && 'character_creator__class_active'}`} onClick={() => character.class = 'druid'}>
          Друид
        </div>
      </div>
      <input type="text" className='character_creator__name' placeholder='Имя персонажа' onChange={(e) => character.name= e.target.value} />
      <div className='character_creator__done' onClick={saveCharactor}>
        Создать
      </div>
      <div className='character_creator__done' onClick={() => setState({ menu: 'characters' })}>
        Назад
      </div>
    </div>
  )
};

export default inject('store')(observer(CharacterCreator));
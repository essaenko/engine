import * as React from 'react';
import { Store } from 'core/store';

export const CharacterCreator = ({ state, setState }) => {
  let { character, characters } = state;
  
  const saveCharactor = () => {
    localStorage.setItem(
      'game_store',
      JSON.stringify({
        ...state,
        characters: {
          ...characters,
          [character.class]: {
            ...characters[character.class],
            [character.name]: {
              ...(new Store({
                player: {
                  ...character,
                  level: 1,
                  stats: classes[character.class].stats,
                  title: 'player',
                  sprite: 'player',
                },
                scenes: [],
                activeScene: 'Game',
              })).state,
            }
          }
        },
        character: {}
      })
    );
    setState({
      ...state,
      characters: {
        ...characters,
        [character.class]: {
          ...characters[character.class],
          [character.name]: {
            ...(new Store({
              player: {
                ...character,
                level: 1,
                stats: classes[character.class].stats,
                title: 'player',
                sprite: 'player',
              },
              scenes: [],
              activeScene: 'Game',
            })).state,
          }
        }
      },
      character: {},
      menu: 'characters',
    });
  }

  const classes = {
    warrior: {
      stats: {
        intellegence: 5,
        strenght: 10,
        agile: 6,
        armor: 5,
      }
    },
    mage: {
      stats: {
        intellegence: 10,
        strenght: 5,
        agile: 5,
        armor: 2,
      }
    },
    druid: {
      stats: {
        intellegence: 5,
        strenght: 7,
        agile: 7,
        armor: 3,
      }
    },
    hunter: {
      stats: {
        intellegence: 5,
        strenght: 5,
        agile: 10,
        armor: 3,
      }
    }
  }

  const setClass = (cl: string): void => setState({ ...state, character: { ...character, class: cl } });
  const setName = (name: string): void => setState({ ...state, character: { ...character, name } });
  
  return (
    <div className='character_creator'>
      <div className='character_creator__classes'>
        <div className={`character_creator__class ${character.class === 'warrior' && 'character_creator__class_active'}`} onClick={() => setClass('warrior')}>
          Воин
        </div>
        <div className={`character_creator__class ${character.class === 'mage' && 'character_creator__class_active'}`} onClick={() => setClass('mage')}>
          Маг
        </div>
        <div className={`character_creator__class ${character.class === 'hunter' && 'character_creator__class_active'}`} onClick={() => setClass('hunter')}>
          Охотник
        </div>
        <div className={`character_creator__class ${character.class === 'druid' && 'character_creator__class_active'}`} onClick={() => setClass('druid')}>
          Друид
        </div>
      </div>
      <input type="text" className='character_creator__name' placeholder='Имя персонажа' onChange={(e) => setName(e.target.value)} />
      <div className='character_creator__done' onClick={saveCharactor}>
        Создать
      </div>
      <div className='character_creator__done' onClick={() => setState({ ...state, menu: 'characters' })}>
        Назад
      </div>
    </div>
  )
};
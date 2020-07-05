import * as React from 'react';

interface IProps {
  setState: (state: any) => void;
}

export const MainMenu = ({ state, setState }) => <>
  <div className='menu_item' onClick={() => setState({ ...state, menu: 'characters' })}>
    Играть
  </div>
  <div className='menu_item' onClick={() => setState({ ...state, menu: 'settings' })}>
    Настройки
  </div>
  <div className='menu_item' onClick={() => setState({ ...state, menu: 'exit' })}>
    Выход
  </div>
</>
import * as React from 'react';

interface IProps {
  setState: (state: any) => void;
}

export const MainMenu = ({ setState }) => <>
  <div className='menu_item' onClick={() => setState({ menu: 'characters' })}>
    Играть
  </div>
  <div className='menu_item' onClick={() => setState({ menu: 'settings' })}>
    Настройки
  </div>
  <div className='menu_item' onClick={() => setState({ menu: 'exit' })}>
    Выход
  </div>
</>
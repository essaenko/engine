import * as React from 'react';

import { translations } from 'js/utils/translation';

export const GameHoodCharacter = ({ player }) => (<>
  <div className="hood__information">
    <div className="hood__name">
      {player?.name} - {player && translations.classes[player.class]} {player?.level} уровня
    </div>
    <div className="hoor__stats">
      <div className="hood__main-stats">
        Здоровье: {Math.round(player?.stats.health)} / {player?.stats.maxHealth} <br />
        Мана: {Math.round(player?.stats.mana)} / {player?.stats.maxMana} <br />
      </div>
      <div className="hood__other-stats">
        Сила: {player?.stats.strenght} <br />
        Ловкость: {player?.stats.agile} <br />
        Интеллект: {player?.stats.intellegence} <br />
        Защита: {player?.stats.armor} <br />
      </div>
    </div>
  </div>
  
  {player?.target && (
    <div className="hood__information">
      <div className="hood__name">
        Цель: {player?.target.state.name} - {translations.classes[player?.target.state.class]} {player?.target.state.level} уровня
      </div>
      <div className="hoor__stats">
        <div className="hood__main-stats">
          Здоровье: {Math.round(player?.target.state.stats.health)} / {player?.target.state.stats.maxHealth} <br />
          Мана: {Math.round(player?.target.state.stats.mana)} / {player?.target.state.stats.maxMana} <br />
        </div>
        <div className="hood__other-stats">
          Сила: {player?.target.state.stats.strenght} <br />
          Ловкость: {player?.target.state.stats.agile} <br />
          Интеллект: {player?.target.state.stats.intellegence} <br />
          Защита: {player?.target.state.stats.armor} <br />
        </div>
      </div>
    </div>
  )}
</>)
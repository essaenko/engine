import { observable } from 'mobx';

const savedStore = localStorage.getItem('game_store');

export const store = observable({
  ...JSON.parse(savedStore),
});
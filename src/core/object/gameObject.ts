import { Entity } from "core/entity";
import { Character } from "game/entities/character";

export interface IGameObjectState {
  posX: number;
  posY: number;
  target: Entity | Character;
}

export interface IGameObjectInitialState {
  posX: number;
  posY: number;
}

export class GameObject {
  public state: IGameObjectState;

  constructor(state: IGameObjectInitialState) {
    this.setState(state);
  };

  public setState = (state: { [K in keyof IGameObjectState]?: IGameObjectState[K] }): void => {
    this.state = { ...this.state, ...state };
  }
}
import { Core } from 'core/core';
import { Entity } from 'core/entity';
import { ILoopTickEvent } from 'core/eventbus/events';

export interface ICameraConfig {
    follow?: Entity;
    width: number;
    height: number;
    scale?: number;
  }

export class Camera {
  public state: {
    follow?: Entity;
    width: number;
    height: number;
    x?: number;
    y?: number;
    maxX?: number;
    maxY?: number;
    scale?: number;
  };

  constructor(initialState: ICameraConfig) {
    this.state = {
      ...initialState,
    };
    this.setCoords();
    Core.eventBus.subscribe<ILoopTickEvent>('loop:tick', this.update);
  }
  
  private setCoords = () => {
    const {follow, width, height, maxX, maxY, scale = 1} = this.state;
    let [x, y] = [follow.state.posX - width / 2 / scale, follow.state.posY - height / 2 / scale];
  
    if (x > maxX) x = maxX;
    if (x < 0) x = 0;
    if (y > maxY) y =maxY;
    if (y < 0) y = 0;

    this.setState({ x, y });
  };
  
  private update = (event: ILoopTickEvent) => {
    const { follow: { state: followState }, width, height, x, y, maxY, maxX, scale } = this.state;

    if (followState.posX < x + width / 3 / scale) {
      this.setState({ x: followState.posX - width / 3 / scale > 0 ? followState.posX - width / 3 / scale: 0 });
    }
    if (followState.posX > x + width / scale - width / 3 / scale) {
      this.setState({ x: followState.posX - (width / scale - width / 3 / scale) > maxX ? maxX : followState.posX - (width / scale - width / 3 / scale) });
    }
    if (followState.posY < y + height / 3 / scale) {
      this.setState({ y: followState.posY - height / 3 / scale > 0 ? followState.posY - height / 3 / scale: 0 });
    }
    if (followState.posY > y + height / scale - height / 3 / scale) {
      this.setState({ y: followState.posY - (height / scale - height / 3 / scale) > maxY ? maxY : followState.posY - (height / scale - height / 3 / scale) });
    }
  };
  
  public setState = (state: { [K in keyof Camera['state']]?: Camera['state'][K] }) => {
    this.state = {
      ...this.state,
      ...state,
    };

    if (state.maxX || state.maxY) {
      this.setCoords();
    }
  }
}
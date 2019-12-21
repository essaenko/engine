import { Core } from 'core/core';

import { IEntity } from 'core/entity/entity';

export interface ICamera {
  state: {
    follow: IEntity;
    width: number;
    height: number;
    x: number;
    y: number;
    maxX: number;
    maxY: number;
    scale?: number;
  };
  setState: (state: any) => void;
}

export interface ICameraInitialState {
  follow?: IEntity;
  width: number;
  height: number;
  scale?: number;
}

export class Camera implements ICamera {
  public state;

  constructor(initialState: ICameraInitialState) {
    this.state = {
      ...initialState,
    };
    this.setCoords();
    Core.eventBus.subscribe('loop:tick', this.update);
  }
  
  private setCoords = () => {
    const {follow, width, height, maxX, maxY, scale = 1} = this.state;
    let [x, y] = [follow.state.posX - (width / 4 / scale), follow.state.posY - (height / 4 / scale)];
  
    if (x > maxX) x = maxX;
    if (x < 0) x = 0;
    if (y > maxY) y =maxY;
    if (y < 0) y = 0;

    this.setState({ x, y });
  };
  
  private update = (event) => {
    const { follow: { state: followState }, width, height, x, y, maxY, maxX } = this.state;

    if (followState.posX < x + width / 4) {
      this.setState({ x: followState.posX - width / 4 > 0 ? followState.posX - width / 4 : 0 });
    }
    if (followState.posX > x + (width - width / 4)) {
      this.setState({ x: followState.posX - (width - width / 4) > maxX ? maxX : followState.posX - (width - width / 4) });
    }
    if (followState.posY < y + height / 4) {
      this.setState({ y: followState.posY - height / 4 > 0 ? followState.posY - height / 4 : 0 });
    }
    if (followState.posY > y + (height - height / 4)) {
      this.setState({ y: followState.posY - (height - height / 4) > maxY ? maxY : followState.posY - (height - height / 4) });
    }
  };
  
  public setState = (state) => {
    this.state = {
      ...this.state,
      ...state,
    };
  }
}
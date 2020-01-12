import { Core } from 'core/core';
import { Entity } from 'core/entity';

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
    Core.eventBus.subscribe('loop:tick', this.update);
  }
  
  private setCoords = () => {
    const {follow, width, height, maxX, maxY, scale = 1} = this.state;
    let [x, y] = [follow.state.posX - (width / 3 / scale), follow.state.posY - (height / 3 / scale)];
  
    if (x > maxX) x = maxX;
    if (x < 0) x = 0;
    if (y > maxY) y =maxY;
    if (y < 0) y = 0;

    this.setState({ x, y });
  };
  
  private update = (event) => {
    const { follow: { state: followState }, width, height, x, y, maxY, maxX } = this.state;

    if (followState.posX < x + width / 3) {
      this.setState({ x: followState.posX - width / 3 > 0 ? followState.posX - width / 3 : 0 });
    }
    if (followState.posX > x + (width - width / 3)) {
      this.setState({ x: followState.posX - (width - width / 3) > maxX ? maxX : followState.posX - (width - width / 3) });
    }
    if (followState.posY < y + height / 3) {
      this.setState({ y: followState.posY - height / 3 > 0 ? followState.posY - height / 3 : 0 });
    }
    if (followState.posY > y + (height - height / 3)) {
      this.setState({ y: followState.posY - (height - height / 3) > maxY ? maxY : followState.posY - (height - height / 3) });
    }
  };
  
  public setState = (state) => {
    this.state = {
      ...this.state,
      ...state,
    };
  }
}
import { Scene } from '../scene';
import { Entity } from 'core/entity';

declare interface IEvent {

}

declare interface IGameInitedEvent extends IEvent {

}

declare interface IGameStartEvent extends IEvent {
  layer: HTMLCanvasElement
}

declare interface ICanvasRegionClick extends IEvent {
  target?: Entity; 
}

declare interface ILoopTickEvent extends IEvent {
  pressed: number[];
}

declare interface IGameSceneChangeEvent extends IEvent {
  scene: Scene;
}

declare interface ICanvasClick extends IEvent {
  nativeEvent: MouseUIEvent;
}

declare interface ICollisionEvent extends IEvent {
  x: boolean;
  y: boolean;
  target: Entity;
}
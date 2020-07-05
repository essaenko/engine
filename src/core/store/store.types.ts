import { ClassModule } from "game/modules";
import { IPathNode } from "core/pathfinder";

export interface IStoreEntity {
  id: number;
  name?: string;
  actions?: {
    aggro: {
      distance: number;
      spawn: IPathNode;
    }
  };
  class?: ClassModule['state']['title'];
  expirience?: number;
  level?: number;
  collision?: string[];
  posX: number;
  posY: number;
  width: number;
  height: number;
  physics?: {
    gravityX: number;
    gravityY: number;
  };
  speed?: number;
  fill?: string;
  sprite?: string;
  textContent?: {
    content: string | number;
    x: number;
    y: number;
    font: string;
    color: string;
    id: string;
    width: number;
    height: number;
  }[];
  drawShape?: boolean;
  drawPath?: boolean;
  animation?: string;
  title: string;
  scale?: {
    x: number;
    y: number;
  },
}

export interface IStoreScene {
  name: string;
  fill?: string;
  title?: string;
  entities: IStoreEntity[];
  map?: string;
}

export interface IState {
  scenes: IStoreScene[]
  player: IStoreEntity,
  activeScene: string;
};
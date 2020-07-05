
import { IState, IStoreScene } from './store.types';

export class Store {
  public state: IState = {
    scenes: [{
      name: 'Game',
      entities: [
        {
          id: 1,
          title: "statusbar",
          posX: 10,
          posY: 10,
          width: 120,
          height: 15,
          fill: 'rgb(255,255,255)',
        },
        {
          id: 3,
          title: 'cladbone',
          posX: 150,
          posY: 300,
          fill: '#000',
          width: 20,
          height: 20,
          sprite: 'cladbone'
        },
        {
        id: 2,
        title: 'fps',
        posX: 5,
        posY: 5,
        width: 10,
        height: 10,
        textContent: [{
          width: 10,
          height: 10,
          y: 5,
          x: 5,
          color: '#0fff',
          font: '10px Arial',
          id: 'fps_meter',
          content: 0,
        }]
      },
      {
        id: 4,
        title: 'rogue',
        posX: 500,
        posY: 350,
        class: 'hunter' as any,
        expirience: 0,
        level: 1,
        width: 12,
        height: 10,
        name: 'Пустынный разбойник',
        sprite: 'rogue',
        speed: 1,
        actions: {
          aggro: {
            distance: 100,
            spawn: {
              x: 500,
              y: 350,
            }
          }
        }
      }],
      map: 'game',
    }], 
    activeScene: 'Game',
    player: null,
  };

  constructor(state: IState) {
    this.state.activeScene = state.activeScene;
    this.state.player = { ...state.player };
    state.scenes.forEach((scene) => {
      const sceneTmpl = this.state.scenes.find((tmpl) => tmpl.name === scene.name);
      sceneTmpl.entities.forEach((entityTmpl) => {
        const entity = scene.entities.find((e) => e.id === entity.id);
        if (scene.entities.find((e) => e.id === entityTmpl.id)) {
          for(const key in entityTmpl) {
            entityTmpl[key] = entity[key];
          }
        }
      });
    });
    this.state.scenes.find((scene) => scene.name === this.state.activeScene).entities.push(this.state.player);
  }

  public setState = (state: { [K in keyof IState]?: IState[K] }): void => {
    this.state = {
      ...this.state,
      ...state
    }
  }

  public get scene(): IStoreScene {
    return this.state.scenes.find((scene) => scene.name === this.state.activeScene);
  }
}
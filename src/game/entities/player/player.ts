import { SpriteSheet } from 'core/assets/spritesheet';
import { ICollisionEvent, ICanvasRegionClick, ILoopTickEvent, ICanvasClick } from 'core/eventbus/events';
import { Scene } from 'core/scene';
import { Core } from 'core/core';

import { ICharacterInitialState, Character } from 'game/entities/character';
import { ClassModule } from 'game/modules';

export interface IPlayerInitialState {
  level: number;
  class: ClassModule['state']['title'];
  expirience: number;
  posX: number;
  posY: number;
  sprite: SpriteSheet;
  name: string;
}

export class Player extends Character {
  constructor(state: IPlayerInitialState) {
    super({
      ...state, 
      physics: {
        gravityY: 0,
        gravityX: 0,
      },
      title: "player",
      width: 10,
      height: 16,
      fill: 'white',
      scale: {
        x: 22,
        y: 16,
      }
    });

    this.useModule('class', new ClassModule({
      title: state.class,
      parent: this,
    }));
    Core.eventBus.subscribe<ICanvasClick>('canvasClick', this.onCanvasClick);
  }

  public onCanvasClick = ({ nativeEvent: { clientX, clientY }, isContextButton }: ICanvasClick) => {
    if (!this.state.death && isContextButton) {
      const { scene: { state: { camera } } } = this.state;

      this.followNode({ x: clientX / camera.state.scale + camera.state.x, y: clientY / camera.state.scale + camera.state.y });
    }
  }

  public onCollision = (collision: ICollisionEvent) => {
    const { x, y, target } = collision;

    if (x) {
      this.posX = 0;
    }
    if (y) {
      this.posY = 0;
    }

    if (this.state.following && this.state.following.entity === target) {
      this.stopFollow();
    }
  }

  public create = (scene: Scene) => {
    Core.eventBus.subscribe('clickOnEntity', this.setTarget);
  }

  private setTarget = ({ target }: ICanvasRegionClick) => {
    if (this.state.target) {
      this.state.target.setState({ drawShape: false });
    }
    if (this.state.following) {
      this.setState({ following: null });
    }
    if (target !== this && target instanceof Character) {
      this.setState({ target });
      target.setState({ drawShape: true });
    } else {
      this.setState({ target: null })
    }
  }

  public onDeath = () => {
    const { stats, scene } = this.state;
    const cladbone = scene.getEntityByProperty('title', 'cladbone');
    setTimeout(() => {
      this.setState({ stats: { ...stats, health: stats.maxHealth, mana: stats.maxMana }, posX: cladbone.state.posX, posY: cladbone.state.posY, death: false, animation: 'down' });
    }, 5000);
  }

  private handleActions = (): void => {
    const { target, lastSystemKeyDown, following } = this.state;
  
    if (this.input.isKeyPressed('tab') && lastSystemKeyDown + 100 < Date.now()) {
      this.findNearestTarget();
      this.setState({ lastSystemKeyDown: Date.now() });
    }

    if (this.input.isKeyPressed('esc')) {
      if (target) {
        target.setState({ drawShape: false });
        this.setState({ target: null });
      }
      if (following) {
        this.setState({ following: null });
      }
    }
  }

  private handleCasts = () => {    
    if (this.input.isKeyPressed('E')) {
      this.castSpell('slash');
    }
  }
  
  public update = (event: ILoopTickEvent) => {
    const { speed, following, death, animation } = this.state;
    let [ moveX, moveY ] = [0, 0];
    let moveDirection: string;
    this.updateAnimation(animation);
    
    if (this.input.isKeyPressed('S')) {
      moveY = 1;
      moveDirection = 'down';
    }
    if (this.input.isKeyPressed('W')) {
      moveY = -1;
      moveDirection = 'top';
    }
    if (this.input.isKeyPressed('D')) {
      moveX = 1;
      moveDirection = 'right';
    }
    
    if (this.input.isKeyPressed('A')) {
      moveX = -1;
      moveDirection = 'left';
    }


    if (moveDirection && !death) {
      this.updateAnimation(moveDirection, true);
      this.setState({ lastMove: moveDirection });
      
      this.posY += speed * moveY;
      this.posX += speed * moveX;
    }
    if (!death) {
      this.handleCasts();
    }
    this.handleActions();

    if ((this.posX || this.posY) && following) {
      this.setState({ following: null });
    }

    this.checkDisabledState(event);
  };
}

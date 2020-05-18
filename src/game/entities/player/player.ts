import { Entity, IEntityInitialState } from 'core/entity';
import { SpriteSheet } from 'core/assets/spritesheet';
import { ICollisionEvent, ICanvasRegionClick, ILoopTickEvent, ICanvasClick } from 'core/eventbus/events';
import { Scene } from 'core/scene';
import { Core } from 'core/core';
import { ICharaterInitialState, Character } from 'game/entities/character';
import { ClassModule } from 'game/modules';

export class Player extends Character {
  constructor(state: ICharaterInitialState) {
    super(state);

    this.useModule('class', new ClassModule({
      title: state.class,
      parent: this,
    }));
    Core.eventBus.subscribe<ICanvasClick>('canvasClick', this.onCanvasClick);
  }

  public onCanvasClick = ({ nativeEvent: { clientX, clientY } }: ICanvasClick) => {
    if (!this.state.death) {
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
    if (target !== this) {
      this.setState({ target });
      target.setState({ drawShape: true });
    } else {
      if (this.state.target) {
        this.state.target.setState({ drawShape: false });
      }
      this.setState({ target: null })
    }
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
    const { speed, lastMove, animation, following, death } = this.state;
    let [ moveX, moveY ] = [0, 0];
    let moveDirection: string;
    
    if (!death) {
      this.updateAnimation(lastMove);
    } else {
      this.updateAnimation(animation);
    }
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
    this.handleActions();
    this.handleCasts();

    if ((this.posX || this.posY) && following) {
      this.setState({ following: null });
    }

    this.checkDisabledState(event);
  };
}

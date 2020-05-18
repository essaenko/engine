import { EventBus } from 'core/eventbus';
import { ILoopTickEvent, IGameStartEvent, ICanvasClick } from 'core/eventbus/events';
import { Core } from 'core/core';

export class Loop {
  public eventBus: EventBus;
  public pressed: number[] = [];

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.eventBus.subscribe<IGameStartEvent>('game:start', this.initListeners);
    
    return void 0;
  }

  private initListeners = ({ layer }: IGameStartEvent): void => {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      event.preventDefault();
      if (!this.pressed.includes(event.keyCode)) {
        this.pressed.push(event.keyCode);
      }
    });
    
    document.addEventListener('keyup', ({ keyCode }: KeyboardEvent) => {
      this.pressed.splice(this.pressed.indexOf(keyCode), 1);
    });
    
    document.body.addEventListener('click', (event: MouseUIEvent) => {
      event.preventDefault();
    });
    
    window.oncontextmenu = (): boolean => {
      return false;
    }

    layer.addEventListener('click', (event: MouseUIEvent) => {
      Core.eventBus.dispatch<ICanvasClick>('canvasClick', { nativeEvent: event });
    })

    this.initLoop();
  };

  private initLoop = (): void => {
    return void window.requestAnimationFrame(this.tick);
  };

  private tick = (): void => {
    this.eventBus.dispatch<ILoopTickEvent>('loop:tick', {
      pressed: this.pressed,
    });

    return void window.requestAnimationFrame(this.tick);
  }
}

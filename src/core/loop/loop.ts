export class Loop implements ILoop {
  public eventBus: IEventBus;
  public pressed: number[] = [];

  constructor(eventBus) {
    this.eventBus = eventBus;
    this.initListeners();
    
    return void 0;
  }

  private initListeners = (): void => {
    document.addEventListener('keydown', ({ keyCode }: KeyboardEvent) => {
      if (!this.pressed.includes(keyCode)) {
        this.pressed.push(keyCode);
      }
    });
    document.addEventListener('keyup', ({ keyCode }: KeyboardEvent) => {
      this.pressed.splice(this.pressed.indexOf(keyCode), 1);
    });

    return void this.eventBus.subscribe('game:start', this.initLoop);
  };

  private initLoop = (): void => {
    return void window.requestAnimationFrame(this.tick);
  };

  private tick = (): void => {
    this.eventBus.dispatch('loop:tick', {
      pressed: this.pressed,
    });

    return void window.requestAnimationFrame(this.tick);
  }
}

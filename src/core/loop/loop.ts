export class Loop implements ILoop {
  public eventBus;
  public intervalId;

  constructor(eventBus) {
    this.eventBus = eventBus;
    this.initListeners();
  }

  pressed = [];

  private initListeners = () => {
    document.addEventListener('keydown', ({keyCode}) => {
      if (!this.pressed.includes(keyCode)) {
        this.pressed.push(keyCode);
      }
    });
    document.addEventListener('keyup', ({ keyCode }) => {
      this.pressed.splice(this.pressed.indexOf(keyCode), 1);
    });
    this.eventBus.subscribe('game:start', this.initLoop);
  };

  private initLoop = () => {
    window.requestAnimationFrame(this.tick);
  };

  private tick = () => {
    this.eventBus.dispatch('loop:tick', {
      pressed: this.pressed,
    });
    window.requestAnimationFrame(this.tick);
  }
}

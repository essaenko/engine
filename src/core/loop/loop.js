import { Core } from 'core/core';

export class Loop {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.initListeners();
  }

  pressed = [];

  initListeners = () => {
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

  initLoop = () => {
    this.intervalId = setInterval(this.tick, 1000 / 60);
  };

  tick = () => {
    this.eventBus.dispatch('loop:tick', {
      pressed: this.pressed,
    });
  }
}

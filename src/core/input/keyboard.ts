import { ILoopTickEvent } from "core/eventbus/events";

export class KeyBoard {
  private pressed = [];
  private keyMap = {
    tab: 9,
    enter: 10,
    esc: 27,
    leftAlt: 18,
  }

  constructor() {
    document.addEventListener('visibilitychange', this.onFocusToggle)
  }
  
  onFocusToggle = () => {
    if (document.hidden) {
      this.pressed = [];
    }
  };
  
  isKeyPressed = (char: string): boolean => {
    return this.pressed.includes(this.keyMap[char] || char.charCodeAt(0));
  };
  
  update = (event: ILoopTickEvent) => this.pressed = event.pressed;
}


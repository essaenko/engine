export class KeyBoard {
  private pressed = [];

  constructor() {
    document.addEventListener('visibilitychange', this.onFocusToggle)
  }
  
  onFocusToggle = () => {
    if (document.hidden) {
      this.pressed = [];
    }
  };
  
  isKeyPressed = (char) => this.pressed.includes(char.charCodeAt(0));
  
  update = (event) => this.pressed = event.pressed;
}


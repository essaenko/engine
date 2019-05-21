export class KeyBoard {
  constructor() {
    this.pressed = [];
  }
  
  isKeyPressed = (char) => this.pressed.includes(char.charCodeAt(0));
  
  update = (event) => this.pressed = event.pressed;
}


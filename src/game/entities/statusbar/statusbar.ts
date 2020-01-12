import { Entity } from "core/entity"
import { Player } from "../player";
import { store } from 'js/store/store';

export class StatusBar extends Entity {
  public state: Entity['state'] & {
    player: Player;
  }

  update = (event) => {
    if (this.state.player === void 0) {
      this.setState({ player: this.state.scene.getEntityByProperty('title', 'player') });
    }
  }

  render = (context: CanvasRenderingContext2D) => {
    const playerData = store.player;
    const { posX, posY, width, height, player } = this.state;
    const hood = this.state.scene.assets.getImage('hood');

    context.drawImage(hood, 450, 180, 80, 70, posX, posY, 50, 45);
    context.fillStyle = '#fff';
    context.font = '16px Arial'
    context.fillText(playerData.level, posX + (playerData.level < 10 ? 14 : 10), posY + 27);
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 5; c ++) {
        context.drawImage(hood, 532, 180, 18, 20, posX + 49 + 18 * c, posY + 12.5 * r, 18, 12.5);
      }
      context.drawImage(hood, 550, 180, 35, 20, posX + 49 + 18 * 5, posY + 12.5 * r, 18, 12.5);
    }
  }
}
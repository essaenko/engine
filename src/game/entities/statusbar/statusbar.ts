import { Entity } from "core/entity"
import { ILoopTickEvent } from "core/eventbus/events";

import { Player } from "game/entities/player";
import { Character } from "game/entities/character";
import { levels } from 'game/utils/expirienceMap';


export class StatusBar extends Entity {
  public state: Entity['state'] & {
    player: Player;
  }

  public update = (event: ILoopTickEvent) => {
    if (this.state.player === void 0) {
      this.setState({ player: this.state.scene.getEntityByProperty('title', 'player') });
    }
  }

  private renderStatsPlace = (context: CanvasRenderingContext2D, x: number, y: number) => {
    const hood = this.state.scene.assets.getImage('hood');
    
    for (let fields = 0; fields < 3; fields++) {
      for (let cells = 0; cells < 5; cells ++) {
        context.drawImage(hood, 532, 180, 18, 20, x + 49 + 18 * cells, y + 12.5 * fields, 18, 12.5);
      }
      if (fields === 0) {
        context.drawImage(hood, 550, 180, 35, 20, x + 49 + 18 * 5, y + 12.5 * fields, 18, 12.5);
      } else {
        context.drawImage(hood, 550, 200, 35, 20, x + 49 + 18 * 5, y + 12.5 * fields, 18, 12.5);
      }
    }
  } 

  private renderStatsFillers = (context: CanvasRenderingContext2D, x: number, y: number, target: Character) => {
    const hood = this.state.scene.assets.getImage('hood');
    
    for (let fillers = 0; fillers < 3; fillers++) {
      if (fillers === 0) {
        for (let cells = 0; cells < Math.round(target.state.stats.health / target.state.stats.maxHealth * 10); cells++) {
          context.drawImage(hood, 600, 180 + 20 * fillers, 9, 20, x + 49 + 9 * cells, y + 12.5 * fillers, 9, 12.5);
        }
      } else if (fillers === 1) {
        for (let cells = 0; cells < Math.round(target.state.stats.mana / target.state.stats.maxMana * 10); cells++) {
          context.drawImage(hood, 600, 180 + 20 * fillers, 9, 20, x + 49 + 9 * cells, y + 12.5 * fillers, 9, 12.5);
        }
      } else {
        for (let cells = 0; cells < Math.round(target.state.expirience / levels[target.state.level] * 10); cells++) {
          context.drawImage(hood, 600, 180 + 20 * fillers, 9, 20, x + 49 + 9 * cells, y + 12.5 * fillers, 9, 12.5);
        }
      }
    }
  }

  private renderTarget = (context: CanvasRenderingContext2D) => {
    const hood = this.state.scene.assets.getImage('hood');
    const { player: { state }, posX, posY } = this.state;
    const target: Character = <Character>state.target;
    
    context.drawImage(hood, 450, 180, 80, 70, posX + 170, posY + 20, 50, 45);
    context.fillStyle = '#fff';
    context.font = '16px Arial'
    context.fillText(String(target.state.level), posX + (+target.state.level < 10 ? 184 : 180), posY + 47);

    this.renderStatsPlace(context, posX + 170, posY + 20);
    this.renderStatsFillers(context, posX + 170, posY + 20, <Character>target);
  }

  public render = (context: CanvasRenderingContext2D) => {
    const { posX, posY, player } = this.state;
    const hood = this.state.scene.assets.getImage('hood');

    context.drawImage(hood, 450, 180, 80, 70, posX, posY + 20, 50, 45);
    context.fillStyle = '#fff';
    context.font = '16px Arial'
    context.fillText(String(player.state.level), posX + (+player.state.level < 10 ? 14 : 10), posY + 47);
    
    this.renderStatsPlace(context, posX, posY + 20);
    this.renderStatsFillers(context, posX, posY + 20, player);

    if (player.state.target && player.state.target instanceof Character) {
      this.renderTarget(context);
    }
  }
}
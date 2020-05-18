import { Entity, IEntityInitialState } from 'core/entity';
import { ILoopTickEvent } from 'core/eventbus/events';

export class Fps extends Entity {
  public state: Entity['state'] & { frameCount: number };
  
  constructor(config: IEntityInitialState) {
    super(config);
    this.setState({ frameCount: 0 });
    setInterval(() => {
      this.setState({
        textContent: [{ ...this.state.textContent[0], content: this.state.frameCount }],
        frameCount: 0,
      });
    }, 1000);
  }
  update = (event: ILoopTickEvent) => {
    this.setState({ frameCount: this.state.frameCount + 1 });
  }
}

import { Entity } from 'core/entity';

export class Fps extends Entity {
  public state: Entity['state'] & { timestamp: number };
  
  constructor(config) {
    super(config);
    this.setState({ timestamp: Date.now() });
    setInterval(() => {
      this.setState({
        textContent: [{ ...this.state.textContent[0], content: Math.round(1000/(Date.now() - this.state.timestamp)) }],
      });
    }, 1000);
  }
  update = (event) => {
    this.setState({ timestamp: Date.now() });
  }
}

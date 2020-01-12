import { Animation } from './animation';

export class AnimationGroup {
  public state: Dict<Animation>;

  constructor(initState) {
    this.state = {
      ...initState,
    }
  }
}

export interface IAnimationInitialState {
  frames: [number, number][];
  defaultFrame?: number;
  speed: number;
  name?: string;
  sound?: string;
  execute?: boolean,
}

export class Animation {
  public state: {
    frameTiming: number;
    currentTiming: number;
    currentFrame: number;
    frames: [number, number][];
    play: boolean;
    defaultFrame?: number;
    name?: string;
    sound?: string;
    execute: boolean,
  };

  public onAnimationEnd: (animation: Animation) => void;

  constructor(initState: IAnimationInitialState) {
    this.state = {
      ...initState,
      play: false,
      frameTiming: 1000 / initState.speed,
      currentTiming: 0,
      currentFrame: 0,
      execute: !!initState.execute,
    };
  }
  
  setState = (state: { [K in keyof Animation['state']]?: Animation['state'][K] }) => this.state = { ...this.state, ...state };
  
  play = () => this.setState({ play: true });
  
  stop = () => this.setState({ play: this.state.execute ? true : false });
  
  getFramePosition = (): [number, number] => {
    const { frameTiming, currentTiming, currentFrame, frames, play, defaultFrame } = this.state;
    
    if (play) {
      if (currentTiming + frameTiming > Date.now()) {
        return frames[currentFrame];
      } else {
        this.setState({
          currentTiming: Date.now(),
          currentFrame: currentFrame === frames.length - 1 ? 0 : currentFrame + 1,
        });

        if (currentFrame === frames.length - 1 && this.onAnimationEnd) {
          this.onAnimationEnd(this);
        }
        
        return frames[currentFrame];
      }
    } else {
      return defaultFrame === undefined ? frames[currentFrame] : frames[defaultFrame];
    }
  }
}

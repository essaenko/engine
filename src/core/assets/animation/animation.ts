export class Animation {
  public state: {
    frameTiming: number;
    currentTiming: number;
    currentFrameNumber: number;
    frames: number[];
    play: boolean;
    defaultFrame?: number;
  };

  constructor(initState) {
    this.state = {
      ...initState,
      frameTiming: Math.round(60 / initState.speed /initState.frames.length),
      currentTiming: 0,
      currentFrameNumber: initState.frames[0],
    };
  }
  
  setState = (state) => this.state = { ...this.state, ...state };
  
  play = () => this.setState({ play: true });
  
  stop = () => this.setState({ play: false });
  
  getFrameNumber = (): number => {
    const { frameTiming, currentTiming, currentFrameNumber, frames, play, defaultFrame } = this.state;
    
    if (play) {
      if (currentTiming !== frameTiming) {
        this.setState({ currentTiming: currentTiming + 1 });
        
        return currentFrameNumber;
      } else {
        const currentFrameNumberIndex = frames.indexOf(currentFrameNumber);
        this.setState({
          currentTiming: 0,
          currentFrameNumber: frames[
            currentFrameNumberIndex === frames.length - 1 ?
              0 :
              currentFrameNumberIndex + 1
            ]
        });
        
        return frames[0];
      }
    } else {
      return defaultFrame === undefined ? currentFrameNumber : defaultFrame;
    }
  }
}

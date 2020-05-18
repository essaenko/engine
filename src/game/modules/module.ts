export interface IModuleInitialState {

}

export interface IModuleState {

}

export class Module {
  public state: IModuleState;
  constructor(state: IModuleInitialState) {
    this.setState(state);
  }

  public setState = (state: { [K in keyof IModuleState]?: IModuleState[K] }) => {
    this.state = {
      ...this.state,
      ...state,
    }
  }
}
import { IAnimationInitialState } from "core/assets/animation/animation";

export const animationConfig: Dict<IAnimationInitialState> = {
  top: {
    frames: [[0,8], [1,8], [2,8], [3,8], [4,8], [5,8], [6,8], [7,8], [8,8]],
    speed: 15,
    defaultFrame: 0,
  },
  left: {
    frames: [[0,9], [1,9], [2,9], [3,9], [4,9], [5,9], [6,9], [7,9], [8,9]],
    speed: 15,
    defaultFrame: 0,
  },
  right: {
    frames: [[0,11], [1,11], [2,11], [3,11], [4,11], [5,11], [6,11], [7,11], [8,11]],
    speed: 15,
    defaultFrame: 0,
  },
  down: {
    frames: [[0,10], [1,10], [2,10], [3,10], [4,10], [5,10], [6,10], [7,10], [8,10]],
    speed: 15,
    defaultFrame: 0,
  },
  attack_top: {
    frames: [[0, 12], [1, 12], [2, 12], [3, 12], [4, 12]],
    speed: 15,
    execute: true,
  },
  attack_left: {
    frames: [[0, 13], [1, 13], [2, 13], [3, 13], [4, 13]],
    speed: 15,
    execute: true,
  },
  attack_down: {
    frames: [[0, 14], [1, 14], [2, 14], [3, 14], [4, 14]],
    speed: 15,
    execute: true,
  },
  attack_right: {
    frames: [[0, 15], [1, 15], [2, 15], [3, 15], [4, 12]],
    speed: 15,
    execute: true,
  },
  death: {
    frames: [[0, 20], [1, 20], [2, 20], [3, 20], [4, 20], [5, 20]],
    speed: 15,
    defaultFrame: 5,
  }
};
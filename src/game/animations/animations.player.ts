import { Animation, AnimationGroup } from 'core/assets/animation';

export const playerAnimation = new AnimationGroup({
  top: new Animation({
    frames: [6,7,8],
    speed: 1,
    defaultFrame: 6,
  }),
  down: new Animation({
    frames: [0,1,2],
    speed: 1,
    defaultFrame: 0,
  }),
  left: new Animation({
    frames: [9,10,11],
    speed: 1,
    defaultFrame: 9,
  }),
  right: new Animation({
    frames: [3,4,5],
    speed: 1,
    defaultFrame: 3,
  }),
});

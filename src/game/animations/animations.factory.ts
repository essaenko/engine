import {Animation, AnimationGroup} from 'core/assets/animation';
import {animationConfig} from 'game/animations/animations.config';

export const createAnimation = () => {
  return new AnimationGroup({
    top: new Animation(animationConfig.top),
    left: new Animation(animationConfig.left),
    right: new Animation(animationConfig.right),
    down: new Animation(animationConfig.down),
  });
};
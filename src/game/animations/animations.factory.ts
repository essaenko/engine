import {Animation, AnimationGroup} from 'core/assets/animation';
import {animationConfig} from 'game/animations/animations.config';

export const createAnimation = () => {
  return new AnimationGroup(
    Object.keys(animationConfig)
      .reduce((acc, key) => {
        acc[key] = new Animation({ ...animationConfig[key], name: key });
        
        return acc;
      },
      {})
  );
};
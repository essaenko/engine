import {Loop} from 'core/loop';
import {EventBus} from 'core/eventbus';

const eventBus = new EventBus();
const loop = new Loop(eventBus);

export default {
  eventBus,
  loop,
}

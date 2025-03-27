import { modifier } from 'ember-modifier';

export default modifier(function didInsert(element, [fn, ...args], named) {
  fn(element, args, named);
});

import { modifier } from 'ember-modifier';
import ripplet from 'ripplet.js';

export default modifier(function ripple(element) {
  element.addEventListener('pointerdown', ripplet);
});

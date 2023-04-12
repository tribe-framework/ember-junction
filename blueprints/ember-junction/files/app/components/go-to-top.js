import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class GoToTopComponent extends Component {
  @action
  goToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

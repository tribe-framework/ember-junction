import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class GoToTopComponent extends Component {
  @service colormodes;

  @action
  goToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class HeaderComponent extends Component {
  @action
  toggleBarsIcon() {
    let el = document.querySelector('#main-menu-toggler');
    if (el.attributes['aria-expanded'].value == 'true')
      el.innerHTML = '<i class="fa-light fa-xmark-large text-white"></i>';
    else el.innerHTML = '<i class="fa-light fa-bars-staggered text-white"></i>';
  }
}

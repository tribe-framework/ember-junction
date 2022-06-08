import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class HeaderComponent extends Component {
  @action
  toggleBarsIcon() {
    let el = document.querySelector('#main-menu-toggler');
    if (el.attributes['aria-expanded'].value == 'true')
      el.innerHTML = '<i class="fa-light fa-xmark-large text-white"></i>';
    else
      el.innerHTML =
        '<i class="fa-light fa-bars-staggered text-white fs-1"></i>';
  }

  @action
  collapseMenu() {
    document
      .querySelector('#navbarSupportedContent')
      .classList.remove('navbar-expand');
    document.querySelector('#navbarSupportedContent').classList.remove('show');
    document
      .querySelector('#navbarSupportedContent')
      .classList.add('navbar-collapse');
    document.querySelector('#main-menu-toggler').attributes[
      'aria-expanded'
    ].value = 'false';
    document.querySelector('.tooltip.show').classList.remove('show');
    this.toggleBarsIcon();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

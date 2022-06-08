import Component from '@glimmer/component';

export default class PageLoadingComponent extends Component {
  pageLoaded() {
    document.querySelector('.page-loading').classList.add('d-none');
    document.querySelector('.page').classList.remove('d-none');
  }
}

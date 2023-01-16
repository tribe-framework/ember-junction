import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class TypesListTableRowComponent extends Component {
  @tracked isShowing = false;

  @action
  showOptions() {
    document
      .querySelector('#row-options-' + this.args.object.id)
      .classList.remove('d-none');
    document
      .querySelector('#row-options-' + this.args.object.id)
      .classList.add('d-flex');
  }

  @action
  hideOptions() {
    document
      .querySelector('#row-options-' + this.args.object.id)
      .classList.add('d-none');
    document
      .querySelector('#row-options-' + this.args.object.id)
      .classList.remove('d-flex');
  }

  @action
  toggleOptions() {
    if (this.isShowing === false) {
      document
        .querySelector('#row-options-' + this.args.object.id)
        .classList.remove('d-none');
      document
        .querySelector('#row-options-' + this.args.object.id)
        .classList.add('d-flex');
      this.isShowing = true;
    }
    else {
      document
        .querySelector('#row-options-' + this.args.object.id)
        .classList.add('d-none');
      document
        .querySelector('#row-options-' + this.args.object.id)
        .classList.remove('d-flex');
      this.isShowing = false;
    }
  }
}

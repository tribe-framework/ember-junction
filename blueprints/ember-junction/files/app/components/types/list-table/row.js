import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class TypesListTableRowComponent extends Component {
  @tracked isShowing = false;
  @tracked isSelected = false;

  inArray = (needle, haysack) => {
    const index = haysack.indexOf(needle);
    if (index > -1) {
      this.isSelected = true;
      return true;
    } else {
      this.isSelected = false;
      return false;
    }
  };

  @action
  showOptions() {
    document
      .querySelector('#row-options-' + this.args.object.id)
      .classList.remove('d-none');
    document
      .querySelector('#row-options-' + this.args.object.id)
      .classList.add('d-block');
  }

  @action
  hideOptions() {
    document
      .querySelector('#row-options-' + this.args.object.id)
      .classList.add('d-none');
    document
      .querySelector('#row-options-' + this.args.object.id)
      .classList.remove('d-block');
  }

  @action
  toggleSelection() {
    if (this.isSelected === false) {
      document
        .querySelector('#row-' + this.args.object.id)
        .classList.add('bg-info');
      this.isSelected = true;
      this.args.addToSelectedRowIDs(this.args.type.slug, this.args.object.id);
    } else {
      document
        .querySelector('#row-' + this.args.object.id)
        .classList.remove('bg-info');
      this.isSelected = false;
      this.args.removeFromSelectedRowIDs(
        this.args.type.slug,
        this.args.object.id,
      );
    }
  }

  @action
  toggleOptions() {
    if (this.isShowing === false) {
      document
        .querySelector('#row-options-' + this.args.object.id)
        .classList.remove('d-none');
      document
        .querySelector('#row-options-' + this.args.object.id)
        .classList.add('d-block');
      this.isShowing = true;
    } else {
      document
        .querySelector('#row-options-' + this.args.object.id)
        .classList.add('d-none');
      document
        .querySelector('#row-options-' + this.args.object.id)
        .classList.remove('d-block');
      this.isShowing = false;
    }
  }
}

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class TypesListTablePageLengthSelectorComponent extends Component {
  @tracked options = A(['5', '10', '25', '50', '100', '250', '500']);
  @tracked selectedOption = '25';

  @service colormodes;

  @action
  updatePageLength(e) {
    this.selectedOption = e;
    this.args.updatePageLength(e);
  }
}

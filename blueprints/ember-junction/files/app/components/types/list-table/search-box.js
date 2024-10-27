import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class TypesListTableSearchBoxComponent extends Component {
  @service colormodes;
  @service store;
  @service type;
  @service types;

  @action
  async advancedSearch() {
    await this.args.advancedSearch();
  }

  @action
  async search() {
    this.args.changePageNumber(1);
    await this.type.search();
  }
}

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { A } from '@ember/array';

export default class TypesListTableSearchBoxComponent extends Component {
  @tracked searchQuery = null;
  @tracked advancedSearchQuery = A([]);

  @action
  clearSearchQuery() {
    this.args.clearSearch();
    this.searchQuery = null;
    this.advancedSearchQuery = A([]);
  }
}

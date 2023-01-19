import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class TypesListTableSearchBoxComponent extends Component {
  @tracked searchQuery = null;

  @action
  clearSearchQuery() {
    this.searchQuery = null;
  }
}

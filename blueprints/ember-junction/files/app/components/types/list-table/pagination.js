import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class TypesListTablePaginationComponent extends Component {
  @tracked currentPageNumber = 1;

  @action
  changePageNumber(pageNumber) {
    this.currentPageNumber = pageNumber;
    this.args.updatePageOffset((pageNumber - 1) * this.args.pageLength);
  }
}

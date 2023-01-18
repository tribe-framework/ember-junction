import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class TypesListTableSearchBoxComponent extends Component {
  @tracked searchQuery;
}

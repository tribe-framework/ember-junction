import Component from '@glimmer/component';

export default class TypesListTableComponent extends Component {
  get countListableModules() {
    var count = 0;
    this.args.type.modules.forEach((elem) => {
      if (elem.list_field === true) count++;
    });

    return count;
  }
}

import Component from '@glimmer/component';

export default class TypesListTableHeadComponent extends Component {
  listableModules = () => {
    let cnt = 0;
    Array(this.args.type.modules).forEach((element) => {
      if (element['list_field'] === true) {
        cnt++;
      }
    });
    return cnt;
  };
}

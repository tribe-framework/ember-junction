import Component from '@glimmer/component';

export default class TypesListTableRowOptionsComponent extends Component {
  isLastSlashOrEquals = (id) => {
    let last = id.substr(id.length - 1);
    if (last == '/' || last == '=') return true;
    else return false;
  };
}

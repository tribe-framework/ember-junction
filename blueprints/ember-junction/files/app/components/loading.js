import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class LoadingComponent extends Component {
  @service type;
  @service colormodes;
  @service blueprints;
}

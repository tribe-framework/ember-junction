import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class FooterComponent extends Component {
  @tracked yearNow = new Date().getFullYear();
}

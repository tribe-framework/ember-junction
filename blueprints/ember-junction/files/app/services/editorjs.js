import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class EditorjsService extends Service {
  @tracked instances = {};
}

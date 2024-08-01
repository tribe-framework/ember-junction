import Service from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class ObjectService extends Service {
  @tracked currentType = null;
  @tracked currentObject = null;
  @tracked reloadingVars = false;
  @tracked viaPublicForm = false;
  @service type;
}

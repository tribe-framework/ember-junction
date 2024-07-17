import Service from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class ModuleService extends Service {
  @tracked currentModule = null;

  @action
  changeModule(module) {
    this.currentModule = module;
  }
}

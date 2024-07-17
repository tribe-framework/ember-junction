import Service from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class BlueprintsService extends Service {
  @tracked junctionBlueprints = null;
  @tracked myBlueprints = null;

  @action
  async getMyBlueprints() {}

  @action
  async getJunctionBlueprints() {}
}

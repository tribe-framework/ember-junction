import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { later } from '@ember/runloop';

export default class TypeRoute extends Route {
  @service types;
  @service type;

  async model(params) {
    this.type.currentType = this.types.json.modules[params.slug];
    later(
      this,
      async () => {
        this.type.editorJSOnTypeChange();
      },
      300,
    );
    return await this.types.json.modules[params.slug];
  }

  afterModel() {
    later(
      this,
      async () => {
        await this.type.loadTypeObjects();
      },
      300,
    );
  }
}

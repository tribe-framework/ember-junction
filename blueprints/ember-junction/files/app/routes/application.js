import Route from '@ember/routing/route';
import { service } from '@ember/service';
import ENV from '<%= dasherizedPackageName %>/config/environment';
import * as bootstrap from 'bootstrap';

export default class ApplicationRoute extends Route {
  @service store;
  @service types;
  @service auth;
  @service router;

  beforeModel() {
    if (
      this.router.currentRouteName != 'auth' &&
      !this.auth.checkIfLoggedIn()
    ) {
      this.router.transitionTo('auth');
    }
  }

  async model() {
    return await this.store.findRecord('webapp', 0, {
      include: ['total_objects'],
    });
  }

  afterModel(data) {
    Object.entries(data.modules).forEach(([key, tp]) => {
      if (key != 'webapp') {
        tp.modules.forEach((e) => {
          if (
            e.input_slug != 'content_privacy' &&
            (e.input_type == 'select' || e.input_type == 'key-value-pair') &&
            (Object.keys(data.modules).includes(e.input_slug) ||
              Object.keys(data.modules).includes(e.linked_type))
          ) {
            if (Object.keys(data.modules).includes(e.input_slug)) {
              let vvv = this.store.query(e.input_slug, {
                show_public_objects_only: false,
                page: { limit: -1 },
              });
            } else if (Object.keys(data.modules).includes(e.linked_type)) {
              let vvv = this.store.query(e.linked_type, {
                show_public_objects_only: false,
                page: { limit: -1 },
              });
            }
          }
        });
      }
    });

    document.querySelector('#loading').classList.add('d-none');
  }
}

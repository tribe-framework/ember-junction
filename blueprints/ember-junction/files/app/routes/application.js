import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { later } from '@ember/runloop';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import * as bootstrap from 'bootstrap';

export default class ApplicationRoute extends Route {
  @service store;
  @service types;
  @service type;
  @service auth;
  @service router;

  @tracked currentRouteName = window.location.pathname.split('/')[1];
  @tracked currentSlugName = window.location.pathname.split('/')[2];

  async beforeModel() {
    await this.auth.getJunctionPassword();
    await this.types.fetchAgain();
    this.auth.goToRouteAfterLogin = this.currentRouteName
      ? this.currentRouteName == 'track'
        ? 'type'
        : this.currentRouteName
      : 'index';
    this.auth.goToSlugAfterLogin = this.currentSlugName;

    if (
      this.auth.goToRouteAfterLogin != 'auth' &&
      this.auth.goToRouteAfterLogin != 'public'
    ) {
      this.auth.checkIfLoggedIn().then(async (checkIfLoggedIn) => {
        if (
          this.auth.goToRouteAfterLogin != 'auth' &&
          this.auth.goToRouteAfterLogin != 'public' &&
          !checkIfLoggedIn
        ) {
          this.router.transitionTo('auth');
        }
      });
    }
  }

  async model() {
    return await this.store.findRecord('webapp', 0, {});
  }

  @action
  didTransition() {
    later(
      this,
      () => {
        if (this.router.currentRouteName != 'type')
          this.type.loadingSearchResults = false;
      },
      300,
    );
  }

  @action
  willTransition() {
    this.type.loadingSearchResults = true;
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

    document.querySelector('#loadingHTML').classList.add('d-none');
  }
}

import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { later } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';

export default class ApplicationRoute extends Route {
  @service store;

  async model() {
    //findRecord for type+slug pair and findAll all objects in a type
    return await this.store.findRecord('types_json', 'webapp');

    //this.store.findAll('film');
    //this.store.query('film', {page: {limit: 2, offset: 0}});
  }

  @action
  willTransition(transition) {
    if (!this.animationLoaded) {
      transition.abort();
      document.querySelector('main').classList.remove('animate__fadeIn');
      document.querySelector('main').classList.add('animate__fadeOut');

      later(
        transition,
        () => {
          this.animationLoaded = true;
          transition.retry();
        },
        700
      );
    }
  }

  @action
  didTransition(transition) {
    document.querySelector('main').classList.remove('animate__fadeOut');
    document.querySelector('main').classList.add('animate__fadeIn');

    later(
      this,
      () => {
        this.animationLoaded = false;
      },
      700
    );
  }
}

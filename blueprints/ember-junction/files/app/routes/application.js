import Route from '@ember/routing/route';
import { service } from '@ember/service';
import ENV from 'junction/config/environment';

export default class ApplicationRoute extends Route {
  @service store;
  @service types;

  async model() {
    return await this.store.findRecord('webapp', 0, {
      include: ['total_objects'],
    });
  }

  afterModel(data) {
    Object.entries(data.modules).forEach(([key, tp]) => {

      if (key != 'webapp') {
        tp.modules.forEach((e)=>{
            if ( e.input_slug != 'content_privacy'
              && e.input_type == 'select'
              && Object.keys(data.modules).includes(e.input_slug) ) {
              let vvv = this.store.query(e.input_slug, {
                show_public_objects_only: false,
                page: { limit: -1 },
              });
            }
        });
      }

    });

    document.querySelector('#loading').classList.add('d-none');
  }
}

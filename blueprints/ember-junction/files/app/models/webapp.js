import Model, { attr } from '@ember-data/model';

export default class WebappModel extends Model {
  @attr slug;
  @attr modules;
}

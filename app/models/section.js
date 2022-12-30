import Model, { attr } from '@ember-data/model';

export default class SectionModel extends Model {
  @attr('tribe-modules') modules;
}

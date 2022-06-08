import Model, { attr } from '@ember-data/model';

export default class TypesJsonModel extends Model {
  //types.json data use schema
  @attr schema;

  //for any data type use modules
  //@attr modules;
}

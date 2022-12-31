import JSONAPIAdapter from '@ember-data/adapter/json-api';
import ENV from 'junction/config/environment';
import { underscore } from '@ember/string';

export default class ApplicationAdapter extends JSONAPIAdapter {
  host = ENV.TribeENV.BASE_URL;
  namespace = 'api.php';

  pathForType(type) {
    return underscore(type);
  }
}

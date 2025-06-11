import JSONAPIAdapter from '@ember-data/adapter/json-api';
import ENV from '<%= dasherizedPackageName %>/config/environment';
import { underscore } from '@ember/string';

export default class ApplicationAdapter extends JSONAPIAdapter {
  host = ENV.TribeENV.API_URL;
  namespace = 'api.php';
  headers = {
    Authorization: `Bearer ${ENV.TribeENV.API_KEY}`,
  };

  pathForType(type) {
    return underscore(type);
  }
}

import EmberRouter from '@ember/routing/router';
import config from '<%= dasherizedPackageName %>/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('types');
  this.route('auth');
  this.route('type', { path: '/type/:slug' });
  this.route('files');
});

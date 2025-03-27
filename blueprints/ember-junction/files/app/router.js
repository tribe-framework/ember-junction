import EmberRouter from '@ember/routing/router';
import config from '<%= dasherizedPackageName %>/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('auth');
  this.route('type', { path: '/track/:slug' });
  this.route('files');
  this.route('public', { path: '/public/form/:slug' });
  this.route('docs');
});

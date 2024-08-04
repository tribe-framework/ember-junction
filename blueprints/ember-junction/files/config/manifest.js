'use strict';

module.exports = function (/* environment, appConfig */) {
  // See https://zonkyio.github.io/ember-web-app for a list of
  // supported properties

  return {
    name: '<%= classifiedPackageName %>',
    short_name: '<%= classifiedPackageName %>',
    description:
      'Frame your data.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#FFF8F0',
    theme_color: '#41B3FF',
    prefer_related_applications: true,
    apple: {
      statusBarStyle: 'black-translucent',
      precomposed: 'true',
    },
    icons: [
      {
        src: '/favicon.png',
        sizes: '512x512',
      },
    ],
    ms: {
      tileColor: '#41B3FF',
    },
  };
};

'use strict';

module.exports = function(/* environment, appConfig */) {
  // See https://zonkyio.github.io/ember-web-app for a list of
  // supported properties

  return {
    name: "<%= classifiedPackageName %>",
    short_name: "<%= classifiedPackageName %>",
    description: "A content management system based on Types.json, by Postcode.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#e9ecef",
    theme_color: "#0A1119",
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
      tileColor: '#0A1119'
    }
  };
}

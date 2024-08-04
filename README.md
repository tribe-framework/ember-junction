# ember-junction

## Compatibility

* ember-tribe 2.x.x


## Installation

```
ember init; yes | ember install ember-tribe; yes | ember install ember-junction;
```
Then fill in the .env file with Tribe credentials and run:
```
php sync-types.php
```

## Build for ember blueprint
After installation a copy of the "app" folder outside the project and:
- Replace "<title>Junction</title>" with "<title><%= classifiedPackageName %></title>"
- Replace "from 'junction/config/environment'" with "from '<%= dasherizedPackageName %>/config/environment'"
- Replace "assets/junction." with "assets/<%= dasherizedPackageName %>."
- Replace "{{page-title "Junction"}}" with "{{page-title "<%= classifiedPackageName %>"}}"
- Move this new "app" folder to ember-junction/blueprints/ember-junction/files/app
- "npm publish" in ember-junction

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](LICENSE.md).

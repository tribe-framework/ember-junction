# ember-junction

## Compatibility

- Ember 6.x

## Installation

```
ember install ember-junction
```

Then fill in the .env file with Tribe API credentials.

```
TRIBE_API_URL="https://<slug>.tribe.junction.express"
TRIBE_API_KEY="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

## Usage

Fully compatible with Ember Data

```
this.store
   .findRecord('page', 24)
   .then((object) => {
   		//
   	})
```

```
this.store
   .query('post', {
   		modules: {
   			user_id: 365,
   		}
   		sort: '-id',
  		page: { limit: -1, offset: 0 },
  		show_public_objects_only: false,
   	})
   .then((objects) => {
   		//
   	})
```

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).

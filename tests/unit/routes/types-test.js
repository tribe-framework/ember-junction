import { module, test } from 'qunit';
import { setupTest } from 'junction/tests/helpers';

module('Unit | Route | types', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:types');
    assert.ok(route);
  });
});

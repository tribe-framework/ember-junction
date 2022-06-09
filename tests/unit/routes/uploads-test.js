import { module, test } from 'qunit';
import { setupTest } from 'junction/tests/helpers';

module('Unit | Route | uploads', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:uploads');
    assert.ok(route);
  });
});

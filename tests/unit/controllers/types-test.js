import { module, test } from 'qunit';
import { setupTest } from 'junction/tests/helpers';

module('Unit | Controller | types', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:types');
    assert.ok(controller);
  });
});

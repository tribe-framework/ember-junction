import { module, test } from 'qunit';
import { setupTest } from 'junction/tests/helpers';

module('Unit | Transform | tribe modules', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let transform = this.owner.lookup('transform:tribe-modules');
    assert.ok(transform);
  });
});

import { module, test } from 'qunit';
import { setupRenderingTest } from 'junction/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | types/list-table', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<Types::ListTable />`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      <Types::ListTable>
        template block text
      </Types::ListTable>
    `);

    assert.dom(this.element).hasText('template block text');
  });
});

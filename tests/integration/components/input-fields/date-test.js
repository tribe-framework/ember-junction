import { module, test } from 'qunit';
import { setupRenderingTest } from 'junction/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | input-fields/date', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<InputFields::Date />`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      <InputFields::Date>
        template block text
      </InputFields::Date>
    `);

    assert.dom(this.element).hasText('template block text');
  });
});

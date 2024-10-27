import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { later } from '@ember/runloop';
import Sortable from 'sortablejs';

export default class PageSummaryCardComponent extends Component {
  @service types;
  @service type;
  @service router;
  @service store;
  @service colormodes;
  @service blueprints;
  @tracked sortable = null;
  @tracked activateReordering = false;
  @tracked modules = Object.entries(this.types.json.modules);
  @tracked reloadTypes = false;

  get typesCount() {
    return this.modules.length;
  }

  @action
  changeType(type) {
    this.type.clearSearchQuery();
    this.type.editorJSOnTypeChange();
    this.type.currentType = type;
    this.type.loadTypeObjects();
    this.router.transitionTo('type', type);
  }

  @action
  startWobble() {
    this.activateReordering = true;
    this.initDragDrop();
  }

  @action
  stopWobble() {
    this.activateReordering = false;
    this.stopDragDrop();
  }

  @action
  stopDragDrop() {
    this.sortable = null;
  }

  @action
  initDragDrop() {
    this.sortable = new Sortable(document.querySelector('#track-names'), {
      group: 'track-names', // or { name: "...", pull: [true, false, 'clone', array], put: [true, false, array] }
      sort: true, // sorting inside list
      delay: 0, // time in milliseconds to define when the sorting should start
      delayOnTouchOnly: false, // only delay if user is using touch
      touchStartThreshold: 0, // px, how many pixels the point should move before cancelling a delayed drag event
      disabled: false, // Disables the sortable if set to true.
      store: null, // @see Store
      animation: 150, // ms, animation speed moving items when sorting, `0` — without animation
      easing: 'cubic-bezier(1, 0, 0, 1)', // Easing for animation. Defaults to null. See https://easings.net/ for examples.
      handle: '.track-name-btn', // Drag handle selector within list items
      filter: '.ignore-elements', // Selectors that do not lead to dragging (String or Function)
      preventOnFilter: true, // Call `event.preventDefault()` when triggered `filter`
      draggable: '.track-name-btn', // Specifies which items inside the element should be draggable

      dataIdAttr: 'data-type-slug', // HTML attribute that is used by the `toArray()` method

      ghostClass: 'sortable-ghost', // Class name for the drop placeholder
      chosenClass: 'sortable-chosen', // Class name for the chosen item
      dragClass: 'sortable-drag', // Class name for the dragging item

      swapThreshold: 1, // Threshold of the swap zone
      invertSwap: false, // Will always use inverted swap zone if set to true
      invertedSwapThreshold: 1, // Threshold of the inverted swap zone (will be set to swapThreshold value by default)
      direction: 'horizontal', // Direction of Sortable (will be detected automatically if not given)

      forceFallback: false, // ignore the HTML5 DnD behaviour and force the fallback to kick in

      fallbackClass: 'sortable-fallback', // Class name for the cloned DOM Element when using forceFallback
      fallbackOnBody: false, // Appends the cloned DOM Element into the Document's Body
      fallbackTolerance: 0, // Specify in pixels how far the mouse should move before it's considered as a drag.

      dragoverBubble: false,
      removeCloneOnHide: true, // Remove the clone element when it is not showing, rather than just hiding it
      emptyInsertThreshold: 5, // px, distance mouse must be from empty sortable to insert drag element into it

      // Element dragging ended
      onEnd: async (evt) => {
        this.modules = Object.entries(this.types.json.modules);
        this.modules = await array_move(
          this.modules,
          evt.oldIndex + 1,
          evt.newIndex + 1,
        );

        function array_move(arr, old_index, new_index) {
          if (new_index >= arr.length) {
            var k = new_index - arr.length + 1;
            while (k--) {
              arr.push(undefined);
            }
          }
          arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
          return arr; // for testing
        }
      },
    });

    this.initialOrder = this.sortable.toArray();
  }

  @action
  async ignoreReordering() {
    if (this.activateReordering === true) {
      this.type.loadingSearchResults = true;
      this.stopWobble();
      this.reloadTypes = true;

      later(
        this,
        () => {
          this.reloadTypes = false;
        },
        1,
      );

      later(
        this,
        () => {
          this.type.loadingSearchResults = false;
        },
        500,
      );
    }
  }

  @action
  async saveReordering() {
    this.type.loadingSearchResults = true;
    this.types.json.modules = await Object.fromEntries(this.modules);

    await this.types.json.save();
    later(
      this,
      async () => {
        window.location.reload(true);
      },
      500,
    );
  }
}

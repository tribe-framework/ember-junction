import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { later } from '@ember/runloop';

export default class TypesModulesListComponent extends Component {
  @service type;
  @service colormodes;
  @service module;
  @service store;
  @service types;
  @tracked reloadTypes = false;

  @action
  highlightLinkages(l) {
    if (l !== undefined && document.querySelector('#track-' + l) !== null) {
      document.querySelector('#track-' + l).classList.add('bg-primary');
    }
  }

  @action
  unhighlightLinkages(l) {
    if (l !== undefined && document.querySelector('#track-' + l) !== null) {
      document.querySelector('#track-' + l).classList.remove('bg-primary');
    }
  }

  @action
  async ignoreReordering() {
    this.type.loadingSearchResults = true;
    this.args.stopWobble();
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

  @action
  async saveReordering() {
    this.type.loadingSearchResults = true;
    await this.types.json.save();
    await this.types.fetchAgain();
    this.type.loadingSearchResults = false;
    this.args.stopWobble();
  }
}

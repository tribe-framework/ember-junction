import Component from '@glimmer/component';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { Modal } from 'bootstrap';
import { action } from '@ember/object';
import Papa from 'papaparse';

export default class TypesListTableTitleBarComponent extends Component {
  @service colormodes;
  @service object;
  @service type;
  @service types;
  @service store;

  @action
  openMultiModal() {
    this.object.reloadingVars = true;
    this.object.currentObject = null;
    this.object.reloadingVars = false;
    let bp = new Modal(
      document.getElementById(
        'editObjectModal-' + this.type.currentType.slug + '-multi',
      ),
      {},
    );
    bp.show();
  }

  @action
  openNewModal() {
    this.object.reloadingVars = true;
    this.object.currentObject = null;
    this.object.reloadingVars = false;
    let bp = new Modal(document.getElementById('editObjectModal'), {});
    bp.show();
  }

  @action
  async papaUnparse() {
    this.type.loadingSearchResults = true;
    let data = await this.store.query(this.type.currentType.slug, {
      sort: '-id',
      show_public_objects_only: false,
      page: { limit: -1, offset: 0 },
    });
    var vvv = [];
    data.forEach(async (obj) => {
      await vvv.push(obj.modules);
    });
    let papa = Papa.unparse(vvv);

    let dd = new Date();

    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(papa);
    hiddenElement.target = '_blank';

    //provide the name for the CSV file to be downloaded
    hiddenElement.download =
      this.type.currentType.slug +
      '_' +
      dd.toISOString().split('T')[0] +
      '_' +
      Math.floor(dd / 1000) +
      '.csv';
    hiddenElement.click();
    this.type.loadingSearchResults = false;
  }
}

import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Papa from 'papaparse';

export default class TypesListTableCsvImportExport extends Component {
  @service colormodes;
  @service object;
  @service type;
  @service types;
  @service store;
  @service gzip;

  @tracked records = [];
  @tracked saving = false;
  @tracked csvRecordLength;
  @tracked csvSaveSuccessCount = 0;

  @action
  async handleProcessedCsvData(csvInfo) {
    this.type.loadingSearchResults = true;

    const { data, headers, rowCount, errors } = csvInfo;

    this.type.showCsvSave = true;

    var donotomit = [];

    if (headers.includes('id')) {
      donotomit.push('id');
      donotomit.push('slug');
    }

    this.type.currentType.modules.forEach((m, i) => {
      if (
        m.input_multiple != true &&
        m.input_type != 'file_uploader' &&
        m.input_type != 'editorjs' &&
        m.var_type != 'json' &&
        m.var_type != 'array' &&
        m.input_slug != 'updated_on' &&
        m.input_slug != 'created_on' &&
        m.input_slug != 'type'
      ) {
        donotomit.push(m.input_slug);
      }
    });

    data.forEach((row) => {
      // Filter out keys not in donotomit
      const keysToRemove = Object.keys(row).filter(
        (key) => !donotomit.includes(key),
      );

      // Remove those keys
      keysToRemove.forEach((key) => delete row[key]);
    });

    // Process the CSV data
    data.forEach(async (row) => {
      if (row.id !== undefined) {
        this.store
          .findRecord(this.type.currentType.slug, row.id)
          .then(async (o) => {
            o.modules = row;
            this.records.push(o);
          });
      } else {
        const o = this.store.createRecord(this.type.currentType.slug, {
          modules: row,
        });
        this.records.push(o);
      }
    });

    this.type.loadingSearchResults = false;
  }

  @action
  saveAllRecords() {
    this.type.loadingSearchResults = true;
    this.saving = true;
    this.csvSaveSuccessCount = 0;
    this.csvRecordLength = this.records.length;

    let promises = [];
    for (let record of this.records) {
      let promise = record.save().then(() => {
        setTimeout(() => {
          this.csvSaveSuccessCount += 1
        }, 100);
       });

      promises.push(promise);
    }

    Promise.all(promises)
      .then(() => {
        this.saving = false;
      });

    this.type.showCsvSave = false;
    this.type.loadingSearchResults = false;
  }

  @action
  papaUnparseFormat(e) {
    e.preventDefault();
    this.type.loadingSearchResults = true;

    var mmm = [];
    mmm.push('id');
    this.type.currentType.modules.forEach((m) => {
      if (
        m.var_type === undefined ||
        (m.var_type != 'json' && m.var_type != 'array')
      ) {
        mmm.push(m.input_slug);
      }
    });

    var vvv = [];
    vvv.push(mmm);

    let papa = Papa.unparse(vvv);

    let dd = new Date();

    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(papa);
    hiddenElement.target = '_blank';

    //provide the name for the CSV file to be downloaded
    hiddenElement.download =
      'format_' +
      this.type.currentType.slug +
      '_' +
      dd.toISOString().split('T')[0] +
      '_' +
      Math.floor(dd / 1000) +
      '.csv';
    hiddenElement.click();
    this.type.loadingSearchResults = false;
  }

  @action
  async papaUnparse() {
    this.type.loadingSearchResults = true;
    let data = await this.store.query(this.type.currentType.slug, {
      sort: '-id',
      show_public_objects_only: false,
      page: { limit: -1, offset: 0 },
    });

    var mmm = [];
    mmm.push('id');
    mmm.push('type');
    mmm.push('slug');
    mmm.push('created_on');
    mmm.push('updated_on');
    this.type.currentType.modules.forEach((m) => {
      mmm.push(m.input_slug);
    });

    var vvv = [];
    vvv.push(mmm);

    var nnn = [];
    var jjj = [];
    data.forEach((obj) => {
      nnn = [];
      mmm.forEach((m) => {
        if (obj.modules[m] !== undefined) {
          if (typeof obj.modules[m] == 'object') {
            if (obj.modules[m].blocks !== undefined) {
              var jjj = [];
              obj.modules[m].blocks.forEach((o) => {
                jjj.push(o.data.text.replace(/<\/?[^>]+(>|$)/g, ''));
              });
              nnn.push(jjj.join('\n'));
            } else {
              nnn.push(JSON.stringify(obj.modules[m]));
            }
          } else if (typeof obj.modules[m] == 'array') {
            nnn.push(JSON.stringify(obj.modules[m]));
          } else nnn.push(obj.modules[m]);
        } else nnn.push('');
      });
      vvv.push(nnn);
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

  get percentage() {
    return ((this.csvSaveSuccessCount / this.csvRecordLength) * 100).toFixed(1);
  }
}

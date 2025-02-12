import Service from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { later } from '@ember/runloop';
import { service } from '@ember/service';
import { A } from '@ember/array';

export default class TypeService extends Service {
  @service store;
  @service types;
  @service router;

  @tracked currentType = null;

  @tracked searchQuery = null;
  @tracked advancedSearchQuery = [];

  @tracked isAdvancedSearch = false;

  @tracked objectsInType = null;
  @tracked pageLinks = A([]);

  @tracked selectedRowIDs = A([]);
  @tracked loadingSearchResults = false;

  @tracked currentPageNumber = A([]);
  @tracked currentPageOffset = A([]);
  @tracked currentNumberOfPages = A([]);
  @tracked currentPageLength = A([]);

  @tracked sortField = A([]);
  @tracked sortFieldQuery = A([]);
  @tracked sortOrder = A([]);

  @tracked showClearSearchButton = false;
  @tracked totalObjects = this.currentType.total_objects;

  @tracked editObjectModal = document.getElementById('editObjectModal');
  @tracked showModalEvents = A([]);
  @tracked hideModalEvents = A([]);

  @action
  updateSortField(field) {
    if (this.sortField[this.currentType.slug] != field) {
      this.sortField[this.currentType.slug] = field;
      this.sortFieldQuery[this.currentType.slug] = field;
      this.sortOrder[this.currentType.slug] = 'asc';
    } else {
      if (this.sortOrder[this.currentType.slug] == 'asc') {
        this.sortFieldQuery[this.currentType.slug] = '-' + field;
        this.sortOrder[this.currentType.slug] = 'desc';
      } else {
        this.sortFieldQuery[this.currentType.slug] = field;
        this.sortOrder[this.currentType.slug] = 'asc';
      }
    }

    this.sortField = this.sortField;
    this.sortFieldQuery = this.sortFieldQuery;
    this.sortOrder = this.sortOrder;

    this.search();
  }

  @action
  editorJSOnTypeChange() {
    this.hideModalEvents.forEach((u) => {
      this.editObjectModal.removeEventListener('hidden.bs.modal', u);
    });

    this.showModalEvents.forEach((i) => {
      this.editObjectModal.removeEventListener('show.bs.modal', i);
    });
  }

  @tracked title = '';
  @tracked isLive = false;
  @tracked description = '';
  @tracked coverURL = '';
  @tracked buttonText = '';
  @tracked thankyouText = '';
  @tracked modules = {};

  @action
  async savePublicForm(e) {
    e.target.innerHTML = '<i class="fa-solid fa-circle-check"></i> Saved';
    e.target.classList.remove('btn-secondary');
    e.target.classList.add('btn-success');

    var type_slug = this.currentType.slug;

    this.types.json.modules[type_slug].public_form = {};
    this.types.json.modules[type_slug].public_form['is_live'] = this.isLive;
    this.types.json.modules[type_slug].public_form['title'] = this.title;
    this.types.json.modules[type_slug].public_form['button_text'] =
      this.buttonText;
    this.types.json.modules[type_slug].public_form['thankyou_text'] =
      this.thankyouText;
    this.types.json.modules[type_slug].public_form['description'] =
      this.description;
    this.types.json.modules[type_slug].public_form['cover_url'] = this.coverURL;
    this.types.json.modules[type_slug].public_form['modules'] = JSON.stringify(
      this.modules,
    );

    this.types.json.modules[type_slug].public_form =
      this.types.json.modules[type_slug].public_form;

    await this.types.json.save();

    later(
      this,
      () => {
        e.target.innerHTML = '<i class="fa-solid fa-save"></i> Save Changes';
        e.target.classList.add('btn-secondary');
        e.target.classList.remove('btn-success');
      },
      2000,
    );
  }

  @action
  initPublicForm() {
    var type_slug = this.currentType.slug;

    if (this.types.json.modules[type_slug].public_form === undefined)
      this.types.json.modules[type_slug].public_form = {};

    if (this.types.json.modules[type_slug].public_form.is_live === undefined)
      this.isLive = false;
    else this.isLive = this.types.json.modules[type_slug].public_form.is_live;

    if (this.types.json.modules[type_slug].public_form.title === undefined)
      this.title = '';
    else this.title = this.types.json.modules[type_slug].public_form.title;

    if (
      this.types.json.modules[type_slug].public_form.description === undefined
    )
      this.description = '';
    else
      this.description =
        this.types.json.modules[type_slug].public_form.description;

    if (
      this.types.json.modules[type_slug].public_form.button_text === undefined
    )
      this.buttonText = '';
    else
      this.buttonText =
        this.types.json.modules[type_slug].public_form.button_text;

    if (
      this.types.json.modules[type_slug].public_form.thankyou_text === undefined
    )
      this.thankyouText = '';
    else
      this.thankyouText =
        this.types.json.modules[type_slug].public_form.thankyou_text;

    if (this.types.json.modules[type_slug].public_form.cover_url === undefined)
      this.coverURL = '';
    else
      this.coverURL = this.types.json.modules[type_slug].public_form.cover_url;

    if (this.types.json.modules[type_slug].public_form.modules === undefined)
      this.modules = {};
    else
      this.modules = JSON.parse(
        this.types.json.modules[type_slug].public_form.modules,
      );
  }

  @action
  async loadTypeObjects(searchResults = false) {
    var type_slug = this.currentType.slug;

    this.initPublicForm();

    if (this.selectedRowIDs[type_slug] === undefined)
      this.selectedRowIDs[type_slug] = [];

    if (this.currentPageOffset[type_slug] === undefined)
      this.currentPageOffset[type_slug] = 0;

    if (this.currentPageLength[type_slug] === undefined)
      this.currentPageLength[type_slug] = 25;

    if (this.currentPageNumber[type_slug] === undefined)
      this.currentPageNumber[type_slug] = 1;

    if (this.sortField[type_slug] === undefined)
      this.sortField[type_slug] = 'id';

    if (this.sortFieldQuery[type_slug] === undefined)
      this.sortFieldQuery[type_slug] = '-id';

    if (this.sortOrder[type_slug] === undefined)
      this.sortOrder[type_slug] = 'desc';

    this.selectedRowIDs = this.selectedRowIDs;
    this.currentPageOffset = this.currentPageOffset;
    this.currentPageLength = this.currentPageLength;
    this.currentPageNumber = this.currentPageNumber;

    this.sortField = this.sortField;
    this.sortFieldQuery = this.sortFieldQuery;
    this.sortOrder = this.sortOrder;

    if (searchResults !== false) {
      await this.search();
    } else {
      await this.clearSearch();
      this.updatePageLinks();
    }
  }

  @action
  addToSelectedRowIDs(type, id) {
    this.selectedRowIDs[type].push(id);
    this.selectedRowIDs = this.selectedRowIDs;
  }

  @action
  removeFromSelectedRowIDs(type, id) {
    const index = this.selectedRowIDs[type].indexOf(id);
    if (index > -1) {
      this.selectedRowIDs[type].splice(index, 1);
    }

    this.selectedRowIDs = this.selectedRowIDs;
  }

  @action
  emptySelectedRowsInType(type) {
    this.selectedRowIDs[type] = [];
    this.selectedRowIDs = this.selectedRowIDs;
  }

  @action
  updatePageLength(pageLength) {
    this.currentPageNumber[this.currentType.slug] = 1;
    this.currentPageLength[this.currentType.slug] = pageLength;
    this.currentPageOffset[this.currentType.slug] = 0;
    this.loadTypeObjects(this.currentType, true);
  }

  @action
  updatePageOffset(pageOffset) {
    this.currentPageOffset[this.currentType.slug] = pageOffset;
    this.loadTypeObjects(this.currentType, true);
  }

  @action
  async search() {
    if (this.isAdvancedSearch) this.advancedSearch();
    else if (this.searchQuery != '') {
      this.isAdvancedSearch = false;
      this.loadingSearchResults = true;
      this.objectsInType = null;
      this.objectsInType = await this.store.query(this.currentType.slug, {
        show_public_objects_only: false,
        sort: this.sortFieldQuery[this.currentType.slug],
        page: {
          limit: this.currentPageLength[this.currentType.slug],
          offset: this.currentPageOffset[this.currentType.slug],
        },
        filter: { title: this.searchQuery },
      });
      this.loadingSearchResults = false;
      if (
        this.objectsInType.meta !== undefined &&
        this.objectsInType.meta.total_objects !== undefined
      )
        this.totalObjects = this.objectsInType.meta.total_objects;
    } else this.clearSearch();
  }

  @action
  async clearSearch() {
    if (this.currentType !== null) {
      this.isAdvancedSearch = false;
      this.totalObjects = this.currentType.total_objects;
      this.loadingSearchResults = true;
      this.objectsInType = null;

      this.objectsInType = await this.store.query(this.currentType.slug, {
        show_public_objects_only: false,
        sort: this.sortFieldQuery[this.currentType.slug],
        page: {
          limit: this.currentPageLength[this.currentType.slug],
          offset: this.currentPageOffset[this.currentType.slug],
        },
      });
    }

    this.showClearSearchButton = false;
    this.loadingSearchResults = false;
  }

  @action
  async advancedSearch() {
    this.isAdvancedSearch = true;
    this.loadingSearchResults = true;
    this.objectsInType = null;
    this.objectsInType = await this.store.query(this.currentType.slug, {
      show_public_objects_only: false,
      sort: this.sortFieldQuery[this.currentType.slug],
      page: {
        limit: this.currentPageLength[this.currentType.slug],
        offset: this.currentPageOffset[this.currentType.slug],
      },
      filter: { ...this.advancedSearchQuery },
    });

    this.showClearSearchButton = true;
    this.loadingSearchResults = false;
    if (
      this.objectsInType.meta !== undefined &&
      this.objectsInType.meta.total_objects !== undefined
    )
      this.totalObjects = this.objectsInType.meta.total_objects;
  }

  @action
  clearSearchQuery() {
    this.clearSearch();
    this.searchQuery = null;
    this.advancedSearchQuery = [];
  }

  get modulesThatWillBeListed() {
    let v = [];
    Object.entries(this.currentType.modules).forEach(([key, value]) => {
      if (value.list_field === true) {
        v.push(value.input_slug);
      }
    });
    return v;
  }

  @action
  updatePageLinks() {
    this.currentNumberOfPages[this.currentType.slug] =
      Math.ceil(
        Number(this.totalObjects) /
          this.currentPageLength[this.currentType.slug],
      ) ?? 1;
    this.currentNumberOfPages = this.currentNumberOfPages;

    let i = 1;
    this.pageLinks = A([]);
    while (i <= this.currentNumberOfPages[this.currentType.slug]) {
      if (
        i === 1 ||
        i === this.currentNumberOfPages[this.currentType.slug] ||
        i <= this.currentPageNumber[this.currentType.slug] + 3 ||
        i >= this.currentPageNumber[this.currentType.slug] - 3
      )
        this.pageLinks.push(i);
      i++;
    }
    this.pageLinks = this.pageLinks;
  }

  @action
  changePageNumber(pageNumber = 1) {
    this.currentPageNumber[this.currentType.slug] = pageNumber;
    this.currentPageNumber = this.currentPageNumber;

    this.updatePageOffset(
      (pageNumber - 1) * this.currentPageLength[this.currentType.slug],
    );
  }

  @action
  changeType(type) {
    this.clearSearchQuery();
    this.editorJSOnTypeChange();
    this.currentType = type;
    this.loadTypeObjects();
    this.router.transitionTo('type', type);
  }
}

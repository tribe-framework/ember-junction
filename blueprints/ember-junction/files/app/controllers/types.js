import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { A } from '@ember/array';

export default class TypesController extends Controller {
  @service store;
  @service types;

  @tracked searchQuery = null;
  @tracked advancedSearchQuery = [];

  @tracked isAdvancedSearch = false;

  @tracked currentType = null;
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

  @action
  updateSortField(field) {
    if (this.sortField[this.currentType.slug] != field) {
      this.sortField[this.currentType.slug] = field;
      this.sortFieldQuery[this.currentType.slug] = field;
      this.sortOrder[this.currentType.slug] = 'asc';
    }
    else {
      if (this.sortOrder[this.currentType.slug] == 'asc') {
        this.sortFieldQuery[this.currentType.slug] = "-"+field;
        this.sortOrder[this.currentType.slug] = 'desc';
      }
      else {
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
  loadTypeObjects(type, searchResults = false) {
    var type_slug = type.slug;

    this.currentType = type;

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

    if (searchResults === true) {
      this.search();
    } else {
      this.clearSearch();
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
      if (this.objectsInType.meta.total_objects !== undefined)
        this.totalObjects = this.objectsInType.meta.total_objects;
    } else this.clearSearch();
  }

  @action
  async clearSearch() {
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
    if (this.objectsInType.meta.total_objects !== undefined)
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
          this.currentPageLength[this.currentType.slug]
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
      (pageNumber - 1) * this.currentPageLength[this.currentType.slug]
    );
  }
}

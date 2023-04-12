import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { A } from '@ember/array';

export default class TypesController extends Controller {
  @service store;
  @service types;

  @tracked currentType = null;
  @tracked objectsInType = null;
  @tracked pageLinks = A([]);

  @tracked selectedRowIDs = A([]);
  @tracked loadingSearchResults = false;

  @tracked currentPageNumber = A([]);
  @tracked currentPageOffset = A([]);
  @tracked currentNumberOfPages = A([]);
  @tracked currentPageLength = A([]);

  @action
  loadTypeObjects(type) {
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

    this.selectedRowIDs = this.selectedRowIDs;
    this.currentPageOffset = this.currentPageOffset;
    this.currentPageLength = this.currentPageLength;
    this.currentPageNumber = this.currentPageNumber;

    this.updatePageLinks();
    this.clearSearch();
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
    this.currentPageLength[this.currentType.slug] = pageLength;
    this.currentPageOffset[this.currentType.slug] = 0;
    this.loadTypeObjects(this.currentType);
  }

  @action
  updatePageOffset(pageOffset) {
    this.currentPageOffset[this.currentType.slug] = pageOffset;
    this.loadTypeObjects(this.currentType);
  }

  @action
  async search(query) {
    if (query != '') {
      this.loadingSearchResults = true;
      this.objectsInType = null;
      this.objectsInType = await this.store.query(this.currentType.slug, {
        show_public_objects_only: false,
        page: {
          limit: this.currentPageLength[this.currentType.slug],
          offset: this.currentPageOffset[this.currentType.slug],
        },
        filter: { title: query },
      });
      this.loadingSearchResults = false;
    } else this.clearSearch();
  }

  @action
  async clearSearch() {
    this.loadingSearchResults = true;
    this.objectsInType = null;
    
    this.objectsInType = await this.store.query(this.currentType.slug, {
      show_public_objects_only: false,
      page: {
        limit: this.currentPageLength[this.currentType.slug],
        offset: this.currentPageOffset[this.currentType.slug],
      },
    });

    this.loadingSearchResults = false;
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
        Number(this.currentType.total_objects) /
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

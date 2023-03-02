import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class TypesController extends Controller {
  @service store;

  @tracked currentType = null;
  @tracked objectsInType = null;
  @tracked pageLength = 10;
  @tracked pageOffset = 0;
  @tracked pageLinks = null;
  @tracked numberOfPages = Math.ceil(Number(this.currentType.total_objects) / this.pageLength) ?? 1;

  @action
  loadTypeObjects(type) {
    this.currentType = type;
    this.objectsInType = this.store.query(this.currentType.slug, {
      show_public_objects_only: false,
      page: { limit: this.pageLength, offset: this.pageOffset },
    });
  }

  @action
  updatePageLength(pageLength) {
    this.pageLength = pageLength;
    this.pageOffset = 0;
    this.loadTypeObjects(this.currentType);
    this.updatePageLinks();
  }

  @action
  updatePageOffset(pageOffset) {
    this.pageOffset = pageOffset;
    this.loadTypeObjects(this.currentType);
  }

  @action
  search(query) {
    if (query != '') {
      this.objectsInType = this.store.query(this.currentType.slug, {
        show_public_objects_only: false,
        page: { limit: this.pageLength, offset: this.pageOffset },
        filter: {"title": query},
      });
    }
    else
      this.clearSearch();
  }

  @action
  clearSearch() {
    this.objectsInType = this.store.query(this.currentType.slug, {
      show_public_objects_only: false,
      page: { limit: this.pageLength, offset: this.pageOffset },
    });
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
    let i = 1;
    this.pageLinks = [];
    while (i <= this.numberOfPages) {
      this.pageLinks.push(i);
      i++;
    }
    this.pageLinks = this.pageLinks;
  }
}
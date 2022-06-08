import Controller from '@ember/controller';

export default class ApplicationController extends Controller {
  afterModel() {
    //enabling tooltips everywhere
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    const tooltipList = [...tooltipTriggerList].map(
      (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
    );
  }
}

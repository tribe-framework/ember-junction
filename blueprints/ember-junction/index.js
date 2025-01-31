'use strict';

module.exports = {
  normalizeEntityName() {},

  afterInstall(options) {
    return this.addPackagesToProject([
      { name: '@editorjs/editorjs' },
      { name: '@editorjs/image' },
      { name: '@editorjs/header' },
      { name: '@editorjs/raw' },
      { name: '@editorjs/code' },
      { name: '@editorjs/marker' },
      { name: '@editorjs/delimiter' },
      { name: '@editorjs/quote' },
      { name: '@editorjs/list' },
      { name: '@editorjs/attaches' },
      { name: '@editorjs/footnotes' },
      { name: '@editorjs/table' },
      { name: 'editorjs-hyperlink' },
      { name: 'miragejs' },
      { name: 'papaparse' },
      { name: 'sortablejs' },
      { name: 'uuid' },
      { name: 'pretty-print-json' },
    ]);
  },
};

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
      { name: '@editorjs/embed' },
    ]);
  }
};

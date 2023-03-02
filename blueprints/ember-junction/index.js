'use strict';

module.exports = {
  normalizeEntityName() {},
  
  afterInstall(options) {
    return this.addPackagesToProject([
      { name: '@editorjs/editorjs' },
      { name: '@editorjs/image' },
      { name: '@editorjs/header' },
    ]);
  }
};

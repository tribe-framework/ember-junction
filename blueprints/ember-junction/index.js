'use strict';

module.exports = {
  normalizeEntityName() {}, // no-op since we're just adding dependencies

  afterInstall() {
    return this.addAddonsToProject({
      packages: [],
    }).then(() => {
      return this.addPackagesToProject([
        { name: '@ember/string' },
      ]);
    });
  },
};
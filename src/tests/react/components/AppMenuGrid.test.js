const {describe, expect, it} = global;
const fs = require('node:fs');
const path = require('node:path');

const appMenuGridSource = fs.readFileSync(
  path.resolve(__dirname, '../../../react/components/AppMenuGrid.js'),
  'utf8',
);

describe('AppMenuGrid', () => {
  it('keeps the runtime menu label fallback in the rendered card text', () => {
    expect(appMenuGridSource).toContain(
      "resolveRuntimeMenuLabel(item, translate)",
    );
  });
});

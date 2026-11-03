const {describe, it} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(
  path.resolve(__dirname, '../../../react/layouts/DefaultLayout.js'),
  'utf8',
);
const headerSource = fs.readFileSync(
  path.resolve(__dirname, '../../../react/layouts/useDefaultLayoutHeader.js'),
  'utf8',
);
const stylesSource = fs.readFileSync(
  path.resolve(__dirname, '../../../react/layouts/DefaultLayout.styles.js'),
  'utf8',
);

describe('DefaultLayout logo company selector (app-community#1340)', () => {
  it('centers CompanyFilter mode=logo via useDefaultLayoutHeader', () => {
    assert.match(headerSource, /mode="logo"/);
    assert.match(headerSource, /showHeaderLogoCompanySelector/);
    assert.match(source, /showHeaderLogoCompanySelector/);
    assert.match(source, /showInlineCompanyFilter = false/);
  });

  it('does not hardcode page background hex colors', () => {
    assert.doesNotMatch(stylesSource, /#f8f9fa/i);
    assert.doesNotMatch(stylesSource, /backgroundColor:\s*'#[0-9a-fA-F]+'/);
  });
});

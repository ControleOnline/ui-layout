const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const componentSource = fs.readFileSync(
  path.resolve(__dirname, '../../react/components/AppMenuGrid.js'),
  'utf8',
);
const stylesSource = fs.readFileSync(
  path.resolve(__dirname, '../../react/components/AppMenuGrid.styles.js'),
  'utf8',
);

test('AppMenuGrid keeps compact styling scoped to CRM shortcuts from issue #41', () => {
  assert.match(
    componentSource,
    /COMPACT_MENU_LABELS = new Set\(\['viewProspects', 'financialReport'\]\)/,
  );
  assert.match(componentSource, /shouldUseCompactCardLabel\(item\)/);
  assert.match(
    componentSource,
    /shouldUseCompactCardLabel\(item\) && styles\.cardLabelCompact/,
  );
});

test('compact card label style reduces type size without changing default cardLabel', () => {
  assert.match(stylesSource, /cardLabelCompact:\s*\{/);
  assert.match(
    stylesSource,
    /cardLabelCompact:[\s\S]*?fontSize:\s*isCompact \? 11 : 12/,
  );
  assert.match(
    stylesSource,
    /cardLabel:[\s\S]*?fontSize:\s*isCompact \? 13 : 14/,
  );
});

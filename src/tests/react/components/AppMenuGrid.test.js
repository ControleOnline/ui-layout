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

  it('uses one company-theme tone for every icon in the same menu segment', () => {
    expect(appMenuGridSource).toContain('module.color');
    expect(appMenuGridSource).toContain('color={segmentTone.foreground}');
    expect(appMenuGridSource).not.toContain('resolveIconColor(item.color');
  });

  it('uses the company action colors consistently in section headers', () => {
    expect(appMenuGridSource).toContain('colorTokens = {}');
    expect(appMenuGridSource).toContain('styles.palette.sectionTone.background');
    expect(appMenuGridSource).toContain('styles.palette.sectionTone.foreground');
  });

  it('keeps section markers strong and item markers visually lighter', () => {
    expect(appMenuGridSource).toContain('styles.palette.sectionTone.background');
    expect(appMenuGridSource).toContain('backgroundColor: segmentTone.background');
    expect(appMenuGridSource).toContain('color={segmentTone.foreground}');
  });
});

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const brandSrc = fs.readFileSync(
  path.join(__dirname, '../../../react/components/HeaderCompanyBrand.js'),
  'utf8',
);
const stylesSrc = fs.readFileSync(
  path.join(__dirname, '../../../react/components/HeaderCompanyBrand.styles.js'),
  'utf8',
);

assert.ok(brandSrc.includes('HeaderCompanyBrand'));
assert.ok(brandSrc.includes('label'));
assert.ok(brandSrc.includes('logoSource'));
assert.ok(stylesSrc.includes("alignItems: 'center'"));
assert.ok(stylesSrc.includes('marginTop'));
console.log('HeaderCompanyBrand structure checks passed');

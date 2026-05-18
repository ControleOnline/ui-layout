const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const componentSource = fs.readFileSync(
  path.resolve(__dirname, '../../react/components/AppMenuGrid.js'),
  'utf8'
)
const stylesSource = fs.readFileSync(
  path.resolve(__dirname, '../../react/components/AppMenuGrid.styles.js'),
  'utf8'
)

test('AppMenuGrid keeps compact styling scoped to the CRM shortcuts requested in issue #41', () => {
  assert.match(
    componentSource,
    /compactMenuLabels = new Set\(\['viewProspects', 'financialReport'\]\)/
  )
  assert.match(
    componentSource,
    /shouldUseCompactCardLabel\(item\) && styles\.cardLabelCompact/
  )
})

test('compact card label style reduces font size and line height', () => {
  assert.match(stylesSource, /cardLabelCompact:\s*\{[\s\S]*fontSize:\s*isCompact \? 12 : 13/)
  assert.match(stylesSource, /cardLabelCompact:\s*\{[\s\S]*lineHeight:\s*isCompact \? 16 : 17/)
})

const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const appSource = fs.readFileSync(
  path.resolve(__dirname, '../../react/App.js'),
  'utf8'
)

const requiredProviderKeys = ['ROOT', 'MODAL', 'PERSIST']

test('App registers the toast providers required by shell, modal and persistent contexts', () => {
  const positions = requiredProviderKeys.map(providerName =>
    appSource.indexOf(`providerKey={TOAST_PROVIDER_KEYS.${providerName}}`)
  )

  positions.forEach((position, index) => {
    assert.notEqual(
      position,
      -1,
      `${requiredProviderKeys[index]} provider should be registered in App.js`
    )
  })

  assert.equal(
    (appSource.match(/<Toasts/g) || []).length,
    requiredProviderKeys.length,
    'App.js should register one Toasts host per required provider bucket'
  )

  assert.ok(
    positions[0] < positions[1] && positions[1] < positions[2],
    'toast providers should keep root, modal and persistent registration order'
  )
})

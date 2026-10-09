const React = require('react'); const renderer = require('react-test-renderer');
global.IS_REACT_ACT_ENVIRONMENT = true;
jest.mock('@env', () => ({env: {API_ENTRYPOINT: 'http://localhost:8000'}}));
const mockThemeColors = {headerText: '#123abc', textPrimary: '#456def'};
jest.mock('@store', () => ({useStore: name => name === 'theme' ? {getters: {colors: mockThemeColors}} : {getters: {user: {api_key: 'synthetic-test-key'}}}}));
jest.mock('@react-navigation/elements', () => ({Header: p => require('react').createElement('Header', p), getHeaderTitle: (options, fallback) => options.title || fallback}));
jest.mock('react-native', () => {
  const React = require('react'); const c = name => p => React.createElement(name, p, p.children);
  return {Image: c('PublicImage'), View: c('View'), Text: c('Text'), TouchableOpacity: c('Button'), StyleSheet: {create: v => v, absoluteFillObject: {}}};
});
jest.mock('@controleonline/ui-default/src/react/components/files/DefaultFile', () => p => require('react').createElement('AuthenticatedFile', p));
jest.mock('@controleonline/ui-common/src/react/utils/fileUrl', () => ({resolveDefaultFileSource: file => file ? {uri: typeof file === 'string' ? file : file.url || `/files/${file.id}/download`, headers: {'API-TOKEN': 'must-not-leak'}} : null}));
const Logo = require('../../../react/layouts/DefaultCompanyHeaderLogo').default;
const {resolveHeaderCompanyBrand} = require('../../../react/layouts/DefaultCompanyHeaderLogo');
it('prefers the unit logo and preserves the file owner for authenticated resolution', () => {
  const company = {id: 14, logo: {id: 3}}, main = {id: 1, logo: {id: 4}};
  expect(resolveHeaderCompanyBrand(company, main)).toEqual({company, file: company.logo});
  expect(resolveHeaderCompanyBrand({id: 14}, main)).toEqual({company: main, file: main.logo});
});
it('uses DefaultFile for the web logo, retains Home action and falls back visibly on errors', () => {
  const onPress = jest.fn(); let tree;
  renderer.act(() => {tree = renderer.create(React.createElement(Logo, {company: {id: 14, name: 'GYROS', logo: {id: 3}}, onPress}));});
  expect(tree.root.findByType('AuthenticatedFile').props.file).toEqual({id: 3});
  renderer.act(() => tree.root.findByType('Button').props.onPress()); expect(onPress).toHaveBeenCalled();
  renderer.act(() => tree.root.findByType('AuthenticatedFile').props.onError());
  expect(tree.root.findByType('Text').props.children).toBe('GYROS');
  renderer.act(() => tree.unmount());
});

it('keeps the selected company icon ahead of another company logo', () => {
  const company = {id: 3, icon: {id: 7231}}, main = {id: 1, logo: {id: 5}};
  expect(resolveHeaderCompanyBrand(company, main)).toEqual({company, file: company.icon});
});
it('renders branding above the original header and vertically centers the right control', () => {
  const Header = require('../../../react/layouts/DefaultCompanyHeader').default;
  const styles = require('../../../react/layouts/DefaultLayout.styles').default;
  const onHome = jest.fn(), right = jest.fn(); let tree;
  renderer.act(() => {tree = renderer.create(React.createElement(Header, {
    company: {id: 3, logo: {id: 7231}}, route: {name: 'OrderHistoryPage'},
    options: {title: 'Order History', headerRight: right, headerBackVisible: false}, onHome,
  }));});
  const header = tree.root.findByType('Header');
  expect(header.props.title).toBe('Order History');
  expect(header.props.headerRight).toBe(right);
  expect(header.props.headerBackground).toBeUndefined();
  expect(header.props.headerLeft()).toBeNull();
  expect(tree.root.findByType('AuthenticatedFile').props.headers).toEqual({'API-TOKEN': 'synthetic-test-key'});
  expect(styles.headerRightContainer.alignItems).toBe('center');
  expect(styles.headerRightContainer.justifyContent).toBe('flex-end');
  renderer.act(() => tree.root.findByType('Button').props.onPress());
  expect(onHome).toHaveBeenCalledTimes(1);
  renderer.act(() => tree.unmount());
});

it('follows theme changes in the text branding fallback without a fixed color', () => {
  let tree;
  renderer.act(() => {tree = renderer.create(React.createElement(Logo, {company: {name: 'GYROS'}}));});
  expect(tree.root.findByType('Text').props.style.color).toBe('#123abc');
  mockThemeColors.headerText = '#abcdef';
  renderer.act(() => tree.update(React.createElement(Logo, {company: {name: 'GYROS'}})));
  expect(tree.root.findByType('Text').props.style.color).toBe('#abcdef');
  delete mockThemeColors.headerText;
  renderer.act(() => tree.update(React.createElement(Logo, {company: {name: 'GYROS'}})));
  expect(tree.root.findByType('Text').props.style.color).toBe(mockThemeColors.textPrimary);
  mockThemeColors.headerText = '#123abc';
  renderer.act(() => tree.unmount());
});

it('never sends authentication headers to external branding origins or other ports', () => {
  const {resolveHeaderLogoSource} = require('../../../react/layouts/DefaultCompanyHeaderLogo');
  for (const uri of ['https://branding.example/logo.png', 'http://localhost:8001/logo.png', 'data:image/png;base64,AA==', 'blob:https://branding.example/id']) {
    const result = resolveHeaderLogoSource(uri, {}, 'http://localhost:8000');
    expect(result.authenticated).toBe(false);
    expect(result.source).toEqual({uri});
    expect(result.source.headers).toBeUndefined();
  }
  expect(resolveHeaderLogoSource('http://localhost:8000/files/3/download', {}, 'http://localhost:8000').authenticated).toBe(true);
  expect(resolveHeaderLogoSource('https://api.example/files/3/download', {}, 'https://api.example').authenticated).toBe(true);
  expect(resolveHeaderLogoSource('http://api.example/files/3/download', {}, 'https://api.example').authenticated).toBe(false);
});
it('renders external logos through public Image without API credentials', () => {
  let tree;
  renderer.act(() => {tree = renderer.create(React.createElement(Logo, {company: {logo: 'https://branding.example/logo.png'}}));});
  expect(tree.root.findAllByType('AuthenticatedFile')).toHaveLength(0);
  expect(tree.root.findByType('PublicImage').props.source).toEqual({uri: 'https://branding.example/logo.png'});
  expect(tree.root.findByType('PublicImage').props.headers).toBeUndefined();
  renderer.act(() => tree.unmount());
});

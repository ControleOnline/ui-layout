jest.mock('react-native-vector-icons/FontAwesome', () => () => null);
jest.mock('@env', () => ({env: {API_ENTRYPOINT: 'http://localhost:8000', DOMAIN: 'http://localhost:8081'}}));
jest.mock('@store', () => ({useStore: () => ({getters: {}})}));
jest.mock('react-native', () => ({StyleSheet: {create: v => v, absoluteFillObject: {}}, View: 'View', Text: 'Text', TouchableOpacity: 'Button'}));
jest.mock('@controleonline/ui-default/src/react/components/files/DefaultFile', () => () => null);
const {resolveDefaultFileSource} = require('@controleonline/ui-common/src/react/utils/fileUrl');
const {resolveHeaderLogoFile} = require('../../../react/layouts/DefaultCompanyHeaderLogo');
it('corrects the HTTPS URL produced from FileService localhost metadata, retaining tenant and owner', () => {
  const file = {id: 7231, domain: 'localhost:8000', url: '/localhost%3A8000/files/7231/download', public: true};
  const company = {id: 3};
  expect(resolveDefaultFileSource(file, {company}).uri).toBe('https://localhost:8000/localhost%3A8000/files/7231/download');
  const corrected = resolveHeaderLogoFile(file, company, 'http://localhost:8000');
  const source = resolveDefaultFileSource(corrected, {company});
  expect(source.uri).toBe('http://localhost:8000/localhost%3A8000/files/7231/download');
  expect(source.headers['app-domain']).toBe('localhost:8000');
  expect(corrected.id).toBe(7231);
  expect(file.url).toBe('/localhost%3A8000/files/7231/download');
});
it('preserves HTTPS for production and external logos', () => {
  const file = {url: 'https://cdn.example.com/logo.png'};
  expect(resolveHeaderLogoFile(file, {id: 3}, 'http://localhost:8000')).toBe(file);
  const hosted = {id: 2, domain: 'api.example.com', url: '/files/2/download'};
  expect(resolveHeaderLogoFile(hosted, {id: 3}, 'https://api.example.com')).toBe(hosted);
});

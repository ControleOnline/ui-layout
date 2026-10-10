/* global jest */

const React = require('react');
const TestRenderer = require('react-test-renderer');
const {act} = TestRenderer;
const {describe, expect, it} = global;

jest.mock('@store', () => ({
  useStore: name => ({
    getters:
      name === 'people'
        ? {currentCompany: {theme: {colors: {}}}}
        : name === 'theme'
          ? {colors: {}}
          : {messages: {}, pendingMessages: {}},
  }),
}));

jest.mock('react-native', () => {
  const React = require('react');
  const component = name => props => React.createElement(name, props, props.children);

  return {
    Modal: props =>
      React.createElement('modal', props, props.visible ? props.children : null),
    Pressable: component('pressable'),
    StyleSheet: {create: styles => styles},
    Text: component('text'),
    TouchableOpacity: component('touchable-opacity'),
    View: component('view'),
    useWindowDimensions: () => ({width: 1024}),
  };
});

jest.mock('react-native-vector-icons/Feather', () => props => {
  const React = require('react');
  return React.createElement('icon', props);
});

const AppMenuGrid = require('../../../react/components/AppMenuGrid').default;

describe('AppMenuGrid operation information', () => {
  it('opens only for the runtime module id and renders read-only values', () => {
    let renderer;
    act(() => {
      renderer = TestRenderer.create(
        React.createElement(AppMenuGrid, {
          menus: [
            {id: 222, label: 'Operação', menus: [{id: 1, menuKey: 'products'}]},
            {id: 333, label: 'Texto traduzido', menus: [{id: 2, menuKey: 'orders'}]},
          ],
          operationModuleId: 333,
          operationInfo: [
            {key: 'company', label: 'Empresa', value: 'GYROS'},
            {key: 'mode', label: 'Modo de operação', value: 'Garçom (waiter)'},
          ],
        }),
      );
    });

    expect(renderer.root.findAllByProps({testID: 'operation-info-button:222'})).toHaveLength(0);
    const infoButton = renderer.root
      .findAllByType('touchable-opacity')
      .find(node => node.props.testID === 'operation-info-button:333');
    expect(renderer.root.findAllByProps({testID: 'operation-info-dialog'})).toHaveLength(0);

    act(() => infoButton.props.onPress());

    expect(renderer.root.findByProps({testID: 'operation-info-dialog'})).toBeTruthy();
    const renderedText = renderer.root
      .findAllByType('text')
      .flatMap(node => node.children)
      .join(' ');
    expect(renderedText).toContain('GYROS');
    expect(renderedText).toContain('Garçom (waiter)');

    act(() =>
      renderer.root
        .findByProps({accessibilityLabel: 'Fechar configuração do PDV'})
        .props.onPress(),
    );
    expect(renderer.root.findAllByProps({testID: 'operation-info-dialog'})).toHaveLength(0);

    act(() => infoButton.props.onPress());
    act(() =>
      renderer.root
        .findByProps({testID: 'operation-info-backdrop'})
        .props.onPress(),
    );
    expect(renderer.root.findAllByProps({testID: 'operation-info-dialog'})).toHaveLength(0);
  });
});

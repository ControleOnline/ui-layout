const React = require('react');
const ReactDOMServer = require('react-dom/server');
const {jest} = require('@jest/globals');

const {beforeEach, describe, expect, it} = global;

let mockStores = {};

jest.mock('@store', () => ({
  useStore: jest.fn(name => mockStores[name] || {getters: {}}),
  useStores: jest.fn(selector => (typeof selector === 'function' ? selector(mockStores) : mockStores)),
}));

jest.mock('react-native', () => ({
  ActivityIndicator: props => React.createElement('activity-indicator', props),
  StyleSheet: {
    create: styles => styles,
  },
  Text: props => React.createElement('text', null, props.children),
  View: props => React.createElement('view', null, props.children),
}));

const StateStore = require('../../../react/components/StateStore').default;

describe('StateStore', () => {
  beforeEach(() => {
    mockStores = {
      theme: {
        getters: {
          colors: {
            primary: '#0EA5E9',
          },
        },
      },
      orders: {
        getters: {
          error: 'Erro ignorado',
          isLoading: true,
          isSaving: false,
        },
      },
    };
  });

  it('renders the orders mode loading shell from store state', () => {
    const markup = ReactDOMServer.renderToStaticMarkup(
      React.createElement(StateStore, {
        mode: 'orders',
        store: 'orders',
      }),
    );

    expect(markup).toContain('activity-indicator');
    expect(markup).toContain('Carregando: orders');
    expect(markup).not.toContain('Erro ignorado');
  });

  it('renders the orders preset with runtime loading text', () => {
    mockStores.orders.getters.isLoading = false;

    const markup = ReactDOMServer.renderToStaticMarkup(
      React.createElement(StateStore, {
        mode: 'orders',
        loading: 'Carregando pedido...',
      }),
    );

    expect(markup).toContain('activity-indicator');
    expect(markup).toContain('Carregando pedido...');
  });
});

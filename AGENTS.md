## Escopo
- Modulo de layout e estrutura visual compartilhada.
- Cobre shell do app, layout padrao, dock inferior, estilos globais e wrappers de estado.

## Estado
- Este modulo tem implementacao ativa em `src/react` e deve constar em novos prompts.
- Se existir `src/vue`, ela e apenas legado e deve ser ignorada, salvo pedido explicito.

## Quando usar
- Prompts sobre layout global, navegacao estrutural, tema, containers base e componentes estruturais do app.

## Limites
- Nao colocar regra de negocio aqui. Este modulo deve organizar a casca visual e a infraestrutura de tela.

## Regras
- `DefaultLayout` deve priorizar a `route` recebida pela propria screen para decidir barras e dock, usando `navigation.getState()` apenas como fallback.
- Flags de layout vindas na URL ou em deep link, como `showBottomCart` e `showBottomToolBar`, devem aceitar `true`/`false` em string e ser normalizadas antes de decidir overlays.

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
- Quando uma tela operacional de `orders` assumir a propria barra de pagamento/acao, ela deve forcar `showBottomCart: false` e `showBottomToolBar: false` para o layout nao reservar espaco nem renderizar uma segunda barra por baixo.
- O listener global de leitura por teclado do fluxo `POS` pode ser montado pelo layout, mas ele deve apenas ligar/desligar a infraestrutura visual. Regras de materializacao de pedido e adicao de produto continuam pertencendo a `ui-orders`.
- O bloqueio de rotas e a simplificacao visual do `kiosk` devem respeitar `pos-operation-mode=kiosk` sem criar um novo `APP_TYPE`.
- O layout pode redirecionar rotas bloqueadas do `kiosk` de volta para `AddProductScreen`, mas a trava Android fisica pertence ao bridge comum e ao plugin nativo.

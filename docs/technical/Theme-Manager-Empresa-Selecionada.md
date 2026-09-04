# Theme Manager — tema da empresa selecionada

Espelho da wiki: https://github.com/ControleOnline/ui-layout/wiki/Theme-Manager-Empresa-Selecionada

Issue: https://github.com/ControleOnline/app-community/issues/691

A tela `theme-manager-page` (`ui-layout`) resolve um único tema — o da empresa selecionada — via `currentCompany.theme.id`, senão `GET /people_domains?people={id}`, senão fallback embedado, e carrega `GET /themes/{id}`. Não lista a coleção `/themes`.

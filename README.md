# Tambaclima

Landing page responsiva para consultar condições meteorológicas e informações sobre o clima amazônico. O painel oferece dados para Manaus e permite pesquisar as 27 capitais brasileiras.

## Executar localmente

Use um servidor HTTP local, como a extensão Live Server do VS Code, na raiz do repositório. Para consultas ao vivo em `localhost` ou `127.0.0.1`, crie `src/scripts/config.js` a partir de `src/scripts/config.example.js` e informe uma chave Weatherbit. O arquivo local é ignorado pelo Git. Nesse modo, o navegador consulta diretamente os endpoints Weatherbit; a chave fica visível no navegador, portanto use apenas uma chave apropriada para desenvolvimento.

Em implantação na Vercel, configure `WEATHERBIT_API_KEY` como variável de ambiente. A função `api/weather.mjs` valida a capital e consulta os endpoints Current e Forecast Daily no servidor, mantendo a chave fora do cliente. Respostas bem-sucedidas da função podem ser armazenadas na CDN por cinco minutos, com revalidação obsoleta por até dez minutos.

## Dados e contingência

Ao abrir a página, o Tambaclima mostra primeiro, quando disponível, o clima de Manaus salvo na `sessionStorage` da aba. Sem cache correspondente, consulta a Weatherbit. Falhas, timeout, limite de requisições ou chave ausente acionam os dados locais de `src/data/mockedData.json`; esses valores são demonstração e não representam condições atuais. O cache e os dados de demonstração são identificados na interface. A busca e o botão **Atualizar dados** permitem consultar ou atualizar a capital selecionada.

## Funcionalidades

- Condições atuais: temperatura, sensação térmica, umidade, vento, pressão e índice UV.
- Chance de chuva obtida pela previsão diária da Weatherbit.
- Alertas visuais para UV elevado e alta chance de chuva.
- Busca de capitais brasileiras e painel climático detalhado.
- Seção educativa sobre clima e ecossistema amazônico.
- Fallback local e cache por sessão para uso durante falhas da API.

## Tecnologias e estrutura

- HTML, CSS e JavaScript sem framework de frontend.
- Vercel Function em `api/weather.mjs` para chamadas Weatherbit no deploy.
- JSON local de demonstração em `src/data/mockedData.json`.
- Contrato de integração em [`docs/api/openapi.yaml`](docs/api/openapi.yaml).

Não há TypeScript, banco de dados ou autenticação no repositório. Os dados de fallback são estáticos e não devem ser apresentados como dados ao vivo.

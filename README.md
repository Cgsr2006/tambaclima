# 🌤️ Tambaclima

## Executar localmente

Abra `index.html` com a extensão Live Server do VS Code. Para a consulta funcionar, informe a chave Weatherbit em `src/scripts/config.js` (use `config.example.js` como modelo). Esse arquivo é local e está ignorado pelo Git.

O navegador consulta diretamente a Weatherbit. Como o Live Server é estático, ele não lê o `.env`; a chave precisa estar na configuração JavaScript do navegador e fica visível para qualquer pessoa que inspecionar o site publicado. Para um site público, use uma chave com limites de uso apropriados ou um proxy de API.

Quando a consulta falha, o site tenta usar o último resultado salvo na `sessionStorage` desta aba. Se ainda não houver cache, carrega dados de demonstração de `src/data/mockedData.json`, marcados na interface para não serem confundidos com dados atuais. O indicador da navbar mostra se a tela usa dados ao vivo, cache, demonstração ou está sem dados.

O **Tambaclima** é uma *landing page* web responsiva desenvolvida para exibir dados meteorológicos em tempo real da cidade de Manaus, além de apresentar um painel educativo sobre o clima e as curiosidades ambientais da região amazônica.

## 🚀 Funcionalidades

- **Clima em Tempo Real (Manaus):** Exibição de temperatura, sensação térmica, umidade e índice UV de Manaus atualizados via API pública.
- **Seção Amazônia:** Painel informativo sobre o ecossistema climática e curiosidades da Floresta Amazônica.
- **Clima Detalhado & Busca de Cidades:** Consulta detalhada de indicadores climáticos com opção de busca de outras cidades.
- **Modo de Contingência (*Fallback*):** Chaveamento automático para dados em JSON local caso a API externa fique indisponível.

## 🛠️ Tecnologias Utilizadas

- **HTML5 & CSS3** (Estruturação e estilização responsiva sem frameworks)
- **JavaScript / TypeScript** (Lógica de requisições e manipulação de DOM)
- **API WeatherBit** (Provedor de dados climatológicos)
- **Vercel** (Hospedagem e deploy)

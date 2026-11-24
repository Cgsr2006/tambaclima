# 🌤️ Tambaclima

## Executar localmente

Abra `index.html` com a extensão Live Server do VS Code. Para a consulta funcionar, informe a chave Weatherbit em `src/scripts/config.js` (use `config.example.js` como modelo). Esse arquivo é local e está ignorado pelo Git.

O navegador consulta diretamente a Weatherbit. Como o Live Server é estático, ele não lê o `.env`; a chave precisa estar na configuração JavaScript do navegador e fica visível para qualquer pessoa que inspecionar o site publicado. Para um site público, use uma chave com limites de uso apropriados ou um proxy de API.

Ao abrir ou recarregar a página, o site usa primeiro o clima de Manaus salvo na `sessionStorage` desta aba. Sem cache, consulta a Weatherbit e salva o resultado; se a consulta falhar, tenta o cache e depois os dados de demonstração de `src/data/mockedData.json`. Capitais consultadas no painel detalhado seguem o mesmo fluxo e são armazenadas por estado. O botão **Atualizar dados** força uma nova consulta para a capital exibida no painel. O indicador mostra se os dados são ao vivo, de cache, de demonstração ou estão indisponíveis.

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

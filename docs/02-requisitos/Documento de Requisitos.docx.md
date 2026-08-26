**DOCUMENTO DE REQUISITOS – Gerenciador de Academias**

| Data | Versão | Descrição | Responsável |
| :---: | :---: | ----- | :---: |
| 26/08/2026 | 1.0 | Elaboração inicial do Documento de Requisitos do sistema Tambaclima  | Carlos Gabriel Silva Ribeiro |

**1\. Introdução**

**1.1 Objetivo**

Especificar os requisitos funcionais (RF), requisitos não funcionais (RNF) e regras de negócio (RN) para o desenvolvimento da *landing page* **Tambaclima**. O sistema é voltado para a exibição em tempo real de dados meteorológicos de Manaus, um painel com informações e curiosidades climáticas da Amazônia e um panorama das principais capitais do Brasil. Este documento serve de guia para o desenvolvimento, testes e homologação no âmbito da disciplina de Gerência de Configuração. 

**1.2 Escopo do Sistema**

**Incluso:**

* Exibição visual dinâmica de dados meteorológicos de Manaus via API pública (WeatherBit).  
* Seção informativa e interativa com curiosidades sobre o clima e ecossistema amazônico.  
* Mecanismo de *fallback* automático com dados salvos em JSON caso a API externa falhe ou atinja o limite.  
* Panorama simplificado do tempo nas capitais brasileiras (escopo secundário/condicional).  
* Design totalmente responsivo adaptável a celulares, tablets e computadores.

**Fora do Escopo:**

* Sistema de cadastro, autenticação ou área logada de usuários.  
* Consultas a dados históricos meteorológicos de anos passados.  
* Desenvolvimento de aplicativos mobile nativos (Android/iOS).

**2\. Definições, Acrônimos e Abreviações**

| Termo | Definição |
| :---- | :---- |
| API | *Application Programming Interface* — Interface de programação para integração de serviços externos.  |
| GCS | Gerência de Configuração de Software.  |
| IC | Item de Configuração — Artefato controlado por versão no projeto.  |
| JSON | *JavaScript Object Notation* — Formato leve estruturado para armazenamento dos dados locais (*mock*).  |
| MOCK / FallBack | Conjunto de dados locais de reserva para evitar falhas no carregamento visual caso a API fique indisponível.  |
| TypeScript (TS)  | Superset sintático do JavaScript que adiciona tipagem estática ao código.  |
| UV | Radiação Ultravioleta (índice exibido no painel de clima).  |
| WeatherBit | API pública externa utilizada para consulta de dados climatológicos em tempo real.  |
| Vanilla Web  | Desenvolvimento web tradicional utilizando apenas HTML5, CSS3 e JS/TS puros, sem frameworks.  |

**3\. Visão Geral do Sistema**

O **Tambaclima** é um sistema web do tipo *landing page* projetado para oferecer uma consulta rápida, intuitiva e educativa sobre o clima de Manaus e da região amazônica. Ao acessar o site, o usuário encontra na área principal as condições climáticas atuais da cidade de Manaus (temperatura, umidade, vento, chuva e índice UV). Ao rolar a página, é apresentada uma seção com informações relevantes sobre o ecossistema e curiosidades climáticas da Amazônia. Opcionalmente, há um painel secundário com o resumo do tempo em capitais do Brasil. A aplicação é desenvolvida estritamente com **HTML5, CSS3, JavaScript e TypeScript puros (vanilla)** e hospedada na plataforma Vercel. 

**4\. Requisitos Funcionais (RF)**

| ID | Descrição | Prioridade | Depende de |
| :---- | :---- | :---: | :---- |
| RF-01  | **Exibir Clima Atual de Manaus:** O sistema deve apresentar os dados climatológicos em tempo real de Manaus (temperatura, sensação térmica, umidade, índice UV, vento e probabilidade/alerta de chuva).  | Alta | – |
| RF-02 | **Previsão de Curto Prazo:** O sistema deve exibir a previsão do tempo detalhada para o dia atual e os dias subsequentes de curto prazo.  | Alta | RF-01 |
| RF-03 | **Seção de Curiosidades da Amazônia:** O sistema deve apresentar um painel informativo com fatos, dados e curiosidades climáticas sobre a região amazônica.  | Alta | – |
| RF-04 | **Tratamento de Falhas da API (Mock):** O sistema deve carregar automaticamente dados armazenados em arquivo JSON local quando a API WeatherBit falhar, demorar para responder ou exceder o limite de requisições.  | Alta | RF-01 |
| RF-05 | **Alertas e Destaques Visuais:** O sistema deve destacar indicadores de alerta (ex: alta radiação UV, risco de tempestade ou umidade extrema).  | Média | RF-01 |
| RF-06 | **Panorama das Capitais (Escopo Opcional):** O sistema deve permitir visualizar o resumo do clima nas principais capitais do Brasil.  | Baixa | RF-01 |
| RF-07 | **Atualização Manual/Automática:** O sistema deve oferecer ao usuário uma opção para recarregar/atualizar os dados do clima instantaneamente.  | Méda | RF-01 |

**5\. Requisitos Não Funcionais (RNF)**

| ID | Descrição | Prioridade | Depende de |
| :---- | :---- | :---: | :---- |
| RNF-01  | **Responsividade Layout (Desktop-First):** O sistema deve ser totalmente adaptável a telas de smartphones, tablets e computadores via CSS puro.  | Alta | –  |
| RNF-02  | **Desempenho de Carregamento:** A página deve carregar o conteúdo em menos de 3 segundos por se tratar de um site leve sem *overhead* de frameworks.  | Alta | –  |
| RNF-03  | **Usabilidade e Acessibilidade:** A interface deve possuir visual moderno, navegação intuitiva, bom contraste de cores e tipografia legível.  | Alta | –  |
| RNF-04  | **Resiliência e Disponibilidade:** O sistema deve permanecer operacional mesmo diante da indisponibilidade temporária do serviço externo de API.  | Alta | RNF-04 |
| RNF-05  | **Compatibilidade de Navegadores:** O site deve ser funcional nos principais navegadores (Google Chrome, Mozilla Firefox, Safari, Microsoft Edge).  | Média | – |
| RNF-06  | **Padrão de Gerência de Configuração:** O projeto deve seguir a política de ramificação do Git (`main`, `develop`, `feature/*`) e manter a rastreabilidade dos ICs no GitHub.  | Alta | – |

**6\. Regras de Negócio**

| ID | Descrição | Prioridade | Depende de |
| :---- | :---- | :---: | :---- |
| RN-01  | **Cidade Padrão de Acesso:** A cidade padrão carregada na abertura inicial do site deve ser obrigatoriamente Manaus-AM.  | Alta  | – |
| RN-02  | **Chaveamento Transparente para Mock:** Em caso de erro HTTP (4xx/5xx) ou *timeout* na chamada da API externa, o sistema deve acionar os dados do arquivo JSON local de forma transparente via script TypeScript/JS.  | Alta  | RF-04 |
| RN-03  | **Acesso Livre e Público:** Todo o conteúdo da *landing page* deve ser público, sem necessidade de autenticação, formulários de cadastro ou restrição de perfil.  | Alta  | – |
| RN-04 | **Escopo de Dados Históricos:** O sistema limita-se ao clima em tempo real e previsões de curto prazo, não permitindo consultas a históricos retroativos de anos anteriores.  | Média | RF-02 |


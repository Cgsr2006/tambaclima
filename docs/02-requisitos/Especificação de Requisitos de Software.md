**ESPECIFICAÇÃO DE REQUISITOS DE SOFTWARE (ERS)**

|    Data    | Versão |                               Descrição                               |         Responsável         |
| :--------: | :-----: | :---------------------------------------------------------------------: | :--------------------------: |
| 31/08/2026 |   1.0   | Elaboração inicial da Especificação de Requisitos de Software (ERS) | Carlos Gabriel Silva Ribeiro |

**1\. Introdução**

A presente Especificação de Requisitos de Software (ERS) detalha a arquitetura pretendida, os casos de uso, os requisitos de interface e a integração de APIs para o sistema **Tambaclima**. Em 10/11/2026, a implementação está em andamento; os módulos ainda não presentes no repositório são planejados, não implementados.

O sistema consiste em uma *landing page* web construída em **HTML5, CSS3 e JavaScript puro (vanilla)**, sem dependência de frameworks complexos. Seu foco principal é a exibição de dados climáticos em tempo real para a cidade de Manaus-AM, apresentação de fatos/curiosidades climáticas da Amazônia e um panorama das capitais do Brasil.

**2\. Arquitetura Geral do Sistema**

**//***diagrama de pacote*

**2.1 Arquitetura de Camadas**

A arquitetura pretendida segue o padrão cliente-side tradicional em **camadas**. A estrutura atual contém HTML, CSS, JavaScript e JSON; a separação em serviços descrita abaixo é planejada:

1. **Camada de Apresentação (Interface / DOM):** Arquivo `index.html` e estilizações CSS3 (`style.css`), responsáveis por renderizar os cartões de clima, botões e seções de curiosidades.
2. **Camada de Lógica de Aplicação (JavaScript):** Scripts executados no navegador (`src/scripts/script.js`) que manipulam a DOM, capturam eventos do usuário e orquestram a exibição das informações.
3. **Camada de Serviços e Dados (API Service & Mock Fallback):** Módulo de serviço climático a ser implementado encarregado de efetuar as chamadas via `fetch()` para a API WeatherBit e chavear para o `src/data/mockedData.json` caso haja indisponibilidade da rede.

**3\. Modelo de Casos de Uso**

**3.1 Detalhados**

| ID  | ATOR               | DESCRIÇÃO                                                                                                |
| :-- | :----------------- | :--------------------------------------------------------------------------------------------------------- |
| A01 | Usuário/Visitante | Pessoa que acessa a *landing page* para consultar informações climáticas e curiosidades da Amazônia. |
| A02 | API WeatherBit     | Sistema externo provador dos dados meteorológicos brutos via JSON em tempo real.                          |

**3.2 Diagramas de Caso de Uso**

![Diagrama de casos de uso do Tambaclima](diagrama-casos-de-uso.svg)

O visitante pode consultar o clima atual de Manaus, as curiosidades da Amazônia e, opcionalmente, o panorama do clima nas capitais. A API WeatherBit é o ator externo que fornece dados climáticos. O caso de uso de dados locais estende a consulta do clima quando a API está indisponível.

| ID   | Caso de Uso                               | Descrição                                                                                                                                                           |
| ---- | :---------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| UC01 | Visualizar o clima de Manaus              | O usuário acessa a página e visualiza automaticamente a temperatura, umidade, vento, índice UV e alertas climáticos atuais de Manaus.                             |
| UC02 | Consultar curiosidades da Amazônia       | O usuário navega pela seção dedicada a informações e curiosidades sobre o microclima e ecossistema amazônico.                                                   |
| UC03 | Adicionar Fallback (Modo offline / Mock)  | Quando a API falha, o sistema consome os dados locais (`src/data/mockedData.json`) e exibe uma notificação discreta ao usuário informando o uso de dados salvos. |
| UC04 | Consultar Panorama de Capitais (Opcional) | O usuário visualiza os dados meteorológicos resumidos de outras capitais brasileiras.                                                                               |

**3.3 Diagrama de Classes (descrição)**

**UC01 e UC02 (Visualizar Clima de Manaus / Dados educativos sobre Amazônia):**

* ***Ator Principal:*** Usuário (A01).
* ***Fluxo Principal:*** 1\. Usuário acessa o site; 2\. O script TypeScript dispara requisição à API WeatherBit; 3\. Dados são retornados e formatados na tela; 4\. Cartão principal de Manaus é atualizado.

**UC03 (Acionar Fallback):**

* ***Atores:*** Usuário (A01) e API WeatherBit (A02).
* ***Fluxo Exceção:***
  1. Requisição à API excede tempo limite ou retorna status HTTP \>= 400;
  2. O serviço de dados captura o erro;
  3. Arquivo de dados mockados é lido;
  4. Interface exibe aviso de "Dados em modo de contingência".

**4\. Estrutura do Banco de Dados (modelo lógico simplificado)**

Por se tratar de uma aplicação cliente-side sem backend nem Banco de Dados relacional, o armazenamento de dados é estruturado via arquivos **JSON estáticos** e **LocalStorage** do navegador.

**5\. Regras de Validação**

| Código | Regra                        | Ação do sistema                                                                                                                              |
| :------ | :--------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| RV-01   | Validação da resposta Http | Se o código HTTP da requisição à API for diferente de `200 OK`, acionar imediatamente a leitura do arquivo JSON local de dados mockados. |
| RV-02   | Formatação de temperatura  | Valores numéricos de temperatura devem ser arredondados para inteiros ou 1 casa decimal e acompanhados da unidade `°C`.                    |
| RV-03   | Limites do ìndice UV        | Se o índice UV for maior ou igual a 8.0, aplicar cor de destaque de alerta amarelo/vermelho.                                                  |

**6\. Requisitos de Interface**

| ID    | Seção/Componente                              | Descrição da Interface e Funcionalidade                                                                                                                                                                                                                      |
| ----- | :---------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RI-01 | NavBar (Barra de Navegação)                   | Cabeçalho fixo ou superior contendo a marca/logo **Tambaclima** e links de navegação ancorados para rolagem rápida até cada seção da página (*Home*, *Amazônia*, *Detalhes*).                                                             |
| RI-02 | Hero Section (Clima Principal \- Manaus)        | Seção de impacto inicial destacando os dados essenciais e em tempo real de Manaus (cidade padrão): temperatura atual em destaque, ícone da condição do tempo, sensação térmica e resumo rápido.                                                      |
| RI-03 | Seção Amazônia                               | Painel visual e educativo dedicado a informações e curiosidades sobre a região amazônica (ex: rios voadores, umidade da floresta, regime de chuvas e importância ecológica).                                                                             |
| RI-04 | Seção de Clima Detalhado e Seletor de Cidades | Painel com métricas aprofundadas (umidade relativa, índice UV, velocidade do vento, pressão e chance de chuva) integrado a um **campo de busca/seleção de cidades**, permitindo alterar a localidade para consultar outras capitais ou municípios. |
| RI-05 | Layout Responsivo (Mobile-First)                | Adaptação fluida da ordem das 4 seções para dispositivos móveis, tablets e desktops utilizando CSS puro (Flexbox/Grid).                                                                                                                                   |

**7\. Requisitos de API REST**

* **Endpoint Utilizado:** GET \[https://api.weatherbit.io/v2.0/current\](https://api.weatherbit.io/v2.0/current)
* **Parâmetros da Requisição:**

  * **city:** Manaus
  * **country:** BR
  * **key:** \[MINHA\_CHAVE\_DE\_API\_WEATHERBIT\]
  * **lang:** pt
* **Tratamento de Erros de Integração:** Timeout configurado para 5000ms (5 segundos). Se a API não responder no tempo estipulado, aborta a requisição e utiliza a resposta estática do arquivo com dados salvos.

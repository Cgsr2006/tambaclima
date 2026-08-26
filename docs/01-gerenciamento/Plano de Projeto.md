**PLANO DE PROJETO – Tambaclima**

*Tabela 1 Registro de Alterações*

| Data | Versão | Descrição | Responsável |
| :---: | :---: | :---: | :---: |
| 25/08/2026 | 1.0 | Criação do plano de projeto | Carlos Gabriel SIlva Ribeiro |
| 26/08/2026 | 1.1 | Atualização do cronograma geral (15 semanas) e ajuste de escopo  | Carlos Gabriel SIlva Ribeiro |

**1\. Identificação do Projeto**

* **Nome do Projeto:** Landing Page de Informações Climáticas (Tambaclima)  
* **Disciplina:** Gerência de Configuração  
* **Integrantes:** Andrês Miguel Albuquerque Petrelli, Carlos Gabriel Silva Ribeiro, Diorge Guerreiro Ribeiro, Giovanna Coelho Rodrigues e Nataly Ramos Ribeiro  
* **Período do Projeto:** 19/08/2026 a 25/11/2026 


**2\. Objetivo do Projeto**

Desenvolver uma *landing page* responsiva para exibição em tempo real de dados meteorológicos de Manaus (como temperatura, umidade, índice UV e alertas de chuva), complementada por uma seção educativa com informações e curiosidades climáticas sobre a região amazônica, além de um panorama condicional das principais capitais do Brasil. 

**3\. Escopo**

**3.1 Incluído no escopo:**

1. **Planejamento & Documentação de GCS:** Plano de Projeto, Tabela de Requisitos e Planilha de Controle de ICs.  
2. **Protótipo de Interface:** Design das telas e guia de estilos no Figma.  
3. **Aplicação Web (Código-Fonte):**  
   * Landing page responsiva.  
   * Módulo de exibição do clima em tempo real em Manaus integrado à API WeatherBit.  
   * Seção interativa/informativa com dados e curiosidades climáticas da Amazônia.  
   * *(Opcional / Escopo Expandido)*: Panorama resumido de outras capitais brasileiras.  
4. **Relatório Final & Apresentação:** Documentação acadêmica final e slides para defesa do projeto.

**3.2 Fora do escopo:**

* Cadastro de usuários / sistema de *login*.  
* Histórico meteorológico de anos anteriores (foco apenas no clima atual e previsão de curtos períodos).  
* Aplicativo mobile nativo (Android/iOS).


**4\. Cronograma Geral (Macro)**

| Semana | Entregas Previstas |
| :---- | :---- |
| 1 \- 2 | Idealização do projeto, criação do repositório no GitHub, elaboração e finalização do **Plano de Projeto** e **Tabela de Requisitos**.  |
| 3 \- 4 | **Prototipação & Design System**: Definição do layout responsivo, fluxo visual e componentes no Figma (Manaus, Curiosidades Amazônicas e Capitais).  |
| 5 \- 6 | **Setup e Estrutura Frontend**: Configuração do projeto web (React/HTML/CSS), criação dos componentes estáticos e estruturação do layout.  |
| 7 \- 8 | **Seção Amazônia & Layout Responsivo**: Implementação e estilização das seções informativas/curiosidades e garantia de responsividade para dispositivos móveis.  |
| 9 \- 10 | **Integração com API Climatológica**: Conexão com a API WeatherBit para carregar dados em tempo real de Manaus e tratamento de *fallbacks* (dados em *mock* em arquivos JSON).  |
| 11 \- 12 | **Escopo Adicional & Refatoração**: Expansão para exibição de outras capitais do Brasil (se o prazo permitir) e ajustes finos na interface.  |
| 13 \- 14 | **Validação, Testes e Baseline**: Testes de usabilidade e responsividade em múltiplos navegadores, revisão do controle de versão (ICs) e **congelamento da *Baseline*** na branch `main`  |
| 14 \- 15 | **Deploy Final & Apresentação:** Publicação da aplicação na Vercel, finalização do Relatório Final e apresentações nos dias 18 e 25/11.  |

**5\. Metodologia de Desenvolvimento**

**Gerenciamento de Versão:** Uso do GitHub para controle de código-fonte e documentação estruturada em Markdown.

**Estratégia de Ramificação (Branches):**

* **main**: Branch estável mantida apenas com código aprovado.  
* **develop**: Branch para integração contínua.  
* **feature/\[nome-da-funcionalidade\]**: Branches individuais para novas telas ou componentes.

**Gerenciamento de Mudanças:** Propostas discutidas no grupo, com avaliação de impacto no prazo e aprovação por maioria simples.

**6\. Papéis e Responsabilidades**

| Papel | Responsável | Atividades principais |
| :---- | :---- | :---- |
| Gerente de Projeto & GCS  | Carlos Gabriel Silva Ribeiro  | Responsável pelo cronograma, organização do repositório e planilha de ICs.  |
| Desenvolvedores Frontend  | Todos (Andrês, Carlos, Diorge, Giovanna e Nataly)  | Responsáveis pela interface, layout e integração com API de clima.  |
| Documentação & Testes  | Todos (Andrês, Carlos, Diorge, Giovanna e Nataly) | Responsáveis pela redação dos relatórios, testes de usabilidade e revisão dos entregáveis.  |

**7\. Recursos Necessários**

* **Prototipação:** Figma.  
* **Tecnologias Frontend:** HTML, CSS, JavaScript/TypeScript.  
* **API de Clima:** API pública WeatherBit.  
* **Deploy e Hospedagem:** Vercel.  
* **Comunicação:** WhatsApp e reuniões alinhadas da equipe.

**8\. Riscos e Estratégias de Mitigação**

| Risco | Probabilidade | Impacto | Mitigação |
| :---- | ----- | :---: | ----- |
| API de clima ficar indisponível ou estourar limite gratuito  | Média | Alto | Implementar dados em *mock* (arquivos JSON locais) como plano de reserva.  |
| Atraso na entrega de tarefas por falta de tempo  | Média | Médio | Reorganizar o escopo e focar apenas na exibição de dados de Manaus, reduzindo dados de outras capitais.  |
| Incompatibilidade de layout em dispositivos móveis  | Média | Médio | Testar a interface responsiva desde o início do desenvolvimento do CSS/estilização.  |

**9\. Critérios de Sucesso**

* Publicação da *landing page* funcional e acessível via Vercel.  
* Carregamento correto dos dados meteorológicos em tempo real de Manaus.  
* Entrega e congelamento da *baseline* dentro do prazo estabelecido (Semana 9).  
* Organização adequada dos Itens de Configuração (ICs) no GitHub.

**10\. Comunicação**

**Comunicação Rápida e Decisões:** WhatsApp para conversas diárias, avisos e votação de mudanças.

**Repositório Centralizado:** GitHub para submissão de código, branches de feature e documentação técnica.


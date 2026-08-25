Landing Page de Informações Climáticas

**Projeto:** Landing Page de Informações Climáticas

**Disciplina:** Gerência de Configuração

**Integrantes:** Andrês Miguel Albuquerque Petrelli, Carlos Gabriel Silva Ribeiro, Diorge Guerreiro Ribeiro, Giovanna Coelho Rodrigues, Nataly Ramos Ribeiro

## 1. Visão Geral do Projeto

### 1.1 Objetivo

Desenvolver uma aplicação web do tipo _landing page_ responsiva para exibição em tempo real de dados meteorológicos de Manaus (como temperatura, umidade, índice UV e alertas de chuva) e um panorama resumido das principais capitais do Brasil.

### 1.2 Papéis e Responsabilidades

- **Gerente de Projeto & GCS:** Carlos Gabriel Silva Ribeiro — Responsável pelo cronograma, organização do repositório e planilha de ICs.
    
- **Desenvolvedores Frontend:** Todos — Responsável pela interface, layout e integração com API de clima.
    
- **Documentação & Testes:** [Nome do Integrante] — Responsável pela redação dos relatórios, testes de usabilidade e revisão dos entregáveis.

## 2. Escopo do Projeto

### 2.1 Entregáveis (O que SERÁ feito)

1. **Protótipo de Interface:** Design das telas (Figma).
    
2. **Aplicação Web (Código-Fonte):** Landing page responsiva integrada a uma API pública de clima (WeatherBit).
    
3. **Planilha de Controle de ICs:** Registro de versão de todos os artefatos do projeto.
    
4. **Relatório Final & Apresentação:** Documentação completa e slides para a banca/professor.

### 2.2 Fora do Escopo (O que NÃO será feito)

- Cadastro de usuários / sistema de _login_.
    
- Histórico meteorológico de anos anteriores (foco apenas no clima atual e previsão de curtos períodos).
    
- Aplicativo mobile nativo (Android/iOS).

## 3. Gerência de Configuração e Ferramentas

### 3.1 Ferramentas Adotadas

- **Controle de Versão:** GitHub (Gerenciamento do código-fonte e documentação em Markdown).
    
- **Hospedagem / Deploy:** Vercel.
    
- **Comunicação e Tarefas:** WhatsApp.

### 3.2 Lista de Itens de Configuração (ICs)

| **ID do IC** | **Nome do Item**                           | **Tipo de Artefato**    | **Formato**             | **Responsável** |
| ------------ | ------------------------------------------ | ----------------------- | ----------------------- | --------------- |
| `IC-DOC-01`  | Plano de Projeto                           | Documentação            | `.pdf` / `.md`          | [Integrante A]  |
| `IC-UI-01`   | Protótipo da Landing Page                  | Design                  | Figma Link              | [Integrante B]  |
| `IC-SRC-01`  | Código-Fonte Frontend                      | Código (React/HTML/CSS) | Repositório Git         | [Integrante B]  |
| `IC-API-01`  | Módulo de Integração com API Climatológica | Código (JS/TS)          | Repositório Git         | [Integrante C]  |
| `IC-DOC-02`  | Planilha de Controle de ICs                | Registro de GCS         | `.xlsx` / Google Sheets | [Integrante A]  |

### 3.3 Política de Branches no Git

- `main`: Branch estável mantida apenas com código aprovado e pronto para apresentação.
    
- `develop`: Branch de integração das tarefas em desenvolvimento.
    
- `feature/[nome-da-funcionalidade]`: Branches individuais para criação de telas ou componentes específicos.

## 4. Cronograma e Marcos (_Milestones_)

| **Fase / Marco**           | **Descrição da Entrega**                                              | **Prazo Estimado** |
| -------------------------- | --------------------------------------------------------------------- | ------------------ |
| **M1: Planejamento**       | Finalização do Plano de Projeto e protótipo inicial                   | Semana 2           |
| **M2: Estrutura Base**     | Criação do repositório Git, setup do projeto e layout estático        | Semana 4           |
| **M3: Integração**         | Conexão com a API de clima para carregar dados de Manaus              | Semana 6           |
| **M4: Validação & Testes** | Testes de responsividade, ajustes finais e congelamento da _baseline_ | Semana 8           |
| **M5: Entrega Final**      | Publicação online e apresentação do projeto                           | Semana 9           |

## 5. Gerenciamento de Mudanças e Riscos

### 5.1 Fluxo de Mudanças (Simplificado)

Se a equipe decidir adicionar ou alterar algum recurso (ex.: incluir um mapa interativo de Manaus):

1. A mudança é proposta no grupo de comunicação.
    
2. É avaliado o impacto no prazo final do trabalho.
    
3. Se aprovado por mais da metade dos integrantes, cria-se uma nova versão do documento/código no repositório.
### 5.2 Principais Riscos e Contornabilidade

| **Risco Mapeado**                                           | **Impacto** | **Ação Mitigatória / Solução**                                                                          |
| ----------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------- |
| API de clima ficar indisponível ou estourar limite gratuito | Alto        | Implementar dados em _mock_ (arquivos JSON locais) como plano de reserva.                               |
| Atraso na entrega de tarefas por falta de tempo         | Médio       | Reorganizar o escopo e focar apenas na exibição de dados de Manaus, reduzindo dados de outras capitais. |
| Incompatibilidade de layout em dispositivos móveis      | Médio       | Testar a interface responsiva desde o início do desenvolvimento do CSS/estilização.                     |

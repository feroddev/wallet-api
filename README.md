# Sábio Financeiro - API

Este repositório contém o código-fonte da API do **Sábio Financeiro**, uma plataforma completa de gerenciamento financeiro pessoal. A API foi desenvolvida utilizando NestJS, Prisma e PostgreSQL, oferecendo uma solução robusta e escalável para o frontend.

## Tecnologias Utilizadas

- **NestJS**: Framework para construção de APIs
- **Prisma**: ORM para gerenciamento do banco de dados
- **PostgreSQL**: Banco de dados relacional
- **JWT**: Autenticação e autorização de usuários
- **Class Validator**: Validação de dados
- **Docker**: Containerização do ambiente

## Estrutura do Banco de Dados

O sistema utiliza PostgreSQL com os seguintes modelos principais:

### Usuários e Autenticação

- **User**: Armazena informações dos usuários e suas preferências
- **UserPlan**: Histórico de planos utilizados pelo usuário

### Finanças

- **Transaction**: Registro de todas as transações financeiras (receitas e despesas)
- **Category**: Categorias para classificação de transações
- **Budget**: Orçamentos por categoria definidos pelo usuário
- **Goal**: Metas financeiras do usuário

### Cartões e Faturas

- **CreditCard**: Cartões de crédito cadastrados pelo usuário
- **Invoice**: Faturas mensais dos cartões de crédito
- **CreditCardExpense**: Despesas específicas de cartão de crédito

### Contas e Pagamentos

- **BillToPay**: Contas a pagar cadastradas pelo usuário
- **PendingPayment**: Pagamentos pendentes no sistema

## Endpoints da API

### Autenticação

#### POST /auth/register

Registra um novo usuário no sistema.

- **Corpo da requisição**:
  ```json
  {
    "name": "Nome Completo",
    "email": "email@exemplo.com",
    "password": "senha123"
  }
  ```
- **Resposta**: Dados do usuário criado e token JWT

#### POST /auth/login

Autentica um usuário existente.

- **Corpo da requisição**:
  ```json
  {
    "email": "email@exemplo.com",
    "password": "senha123"
  }
  ```
- **Resposta**: Token JWT e informações do usuário

### Usuários

#### GET /users/me

Retorna os dados do usuário autenticado.

- **Headers**: `Authorization: Bearer {token}`
- **Resposta**: Dados do usuário atual

#### PATCH /users/me

Atualiza os dados do usuário autenticado.

- **Headers**: `Authorization: Bearer {token}`
- **Corpo da requisição**:
  ```json
  {
    "name": "Novo Nome"
  }
  ```
- **Resposta**: Dados atualizados do usuário

### Transações

#### POST /transactions

Cria uma nova transação.

- **Headers**: `Authorization: Bearer {token}`
- **Corpo da requisição**:
  ```json
  {
    "name": "Salário",
    "type": "INCOME",
    "categoryId": "id-da-categoria",
    "description": "Pagamento mensal",
    "paymentMethod": "BANK_TRANSFER",
    "date": "2025-06-01T00:00:00Z",
    "totalAmount": 5000,
    "isPaid": true
  }
  ```
- **Resposta**: Dados da transação criada

#### GET /transactions

Lista as transações do usuário.

- **Headers**: `Authorization: Bearer {token}`
- **Query Parameters**:
  - `type`: Tipo de transação (INCOME, EXPENSE)
  - `startDate`: Data inicial
  - `endDate`: Data final
  - `categoryId`: ID da categoria
  - `isPaid`: Status de pagamento
- **Resposta**: Lista de transações

#### PATCH /transactions/:id

Atualiza uma transação existente.

- **Headers**: `Authorization: Bearer {token}`
- **Corpo da requisição**: Campos a serem atualizados
- **Resposta**: Dados atualizados da transação

#### DELETE /transactions/:id

Remove uma transação.

- **Headers**: `Authorization: Bearer {token}`
- **Resposta**: Mensagem de sucesso

### Categorias

#### GET /categories

Lista todas as categorias disponíveis.

- **Headers**: `Authorization: Bearer {token}`
- **Query Parameters**:
  - `type`: Tipo de categoria (INCOME, EXPENSE)
- **Resposta**: Lista de categorias

### Cartões de Crédito

#### POST /credit-cards

Cadastra um novo cartão de crédito.

- **Headers**: `Authorization: Bearer {token}`
- **Corpo da requisição**:
  ```json
  {
    "cardName": "Nubank",
    "lastDigits": 1234,
    "limit": 5000,
    "closingDay": 20,
    "dueDay": 27
  }
  ```
- **Resposta**: Dados do cartão criado

#### GET /credit-cards

Lista os cartões de crédito do usuário.

- **Headers**: `Authorization: Bearer {token}`
- **Resposta**: Lista de cartões

#### PATCH /credit-cards/:id

Atualiza um cartão de crédito.

- **Headers**: `Authorization: Bearer {token}`
- **Corpo da requisição**: Campos a serem atualizados
- **Resposta**: Dados atualizados do cartão

#### DELETE /credit-cards/:id

Remove um cartão de crédito.

- **Headers**: `Authorization: Bearer {token}`
- **Resposta**: Mensagem de sucesso

### Faturas

#### GET /invoices

Lista as faturas do usuário.

- **Headers**: `Authorization: Bearer {token}`
- **Query Parameters**:
  - `creditCardId`: ID do cartão de crédito
  - `isPaid`: Status de pagamento
  - `month`: Mês da fatura
  - `year`: Ano da fatura
- **Resposta**: Lista de faturas

#### PATCH /invoices/:id/pay

Marca uma fatura como paga.

- **Headers**: `Authorization: Bearer {token}`
- **Resposta**: Dados atualizados da fatura

### Orçamentos

#### POST /budgets

Cria um novo orçamento por categoria.

- **Headers**: `Authorization: Bearer {token}`
- **Corpo da requisição**:
  ```json
  {
    "category": "id-da-categoria",
    "limit": 1000,
    "month": 6,
    "year": 2025
  }
  ```
- **Resposta**: Dados do orçamento criado

#### GET /budgets

Lista os orçamentos do usuário.

- **Headers**: `Authorization: Bearer {token}`
- **Query Parameters**:
  - `month`: Mês do orçamento
  - `year`: Ano do orçamento
- **Resposta**: Lista de orçamentos com valores gastos e disponíveis

#### PATCH /budgets/:id

Atualiza um orçamento existente.

- **Headers**: `Authorization: Bearer {token}`
- **Corpo da requisição**: Campos a serem atualizados
- **Resposta**: Dados atualizados do orçamento

#### DELETE /budgets/:id

Remove um orçamento.

- **Headers**: `Authorization: Bearer {token}`
- **Resposta**: Mensagem de sucesso

### Planos de Assinatura

#### GET /plans

Lista todos os planos de assinatura disponíveis.

- **Resposta**: Lista de planos com preços e recursos

#### PATCH /plans/:id

Atualiza o plano de assinatura do usuário.

- **Headers**: `Authorization: Bearer {token}`
- **Resposta**: Mensagem de sucesso

### Contas a Pagar

#### POST /bills

Cria uma nova conta a pagar.

- **Headers**: `Authorization: Bearer {token}`
- **Corpo da requisição**:
  ```json
  {
    "name": "Aluguel",
    "description": "Pagamento mensal",
    "amount": 1500,
    "dueDate": "2025-06-15T00:00:00Z",
    "isRecurring": true,
    "recurrenceDay": 15
  }
  ```
- **Resposta**: Dados da conta criada

#### GET /bills

Lista as contas a pagar do usuário.

- **Headers**: `Authorization: Bearer {token}`
- **Query Parameters**:
  - `isPaid`: Status de pagamento
  - `startDate`: Data inicial
  - `endDate`: Data final
- **Resposta**: Lista de contas a pagar

#### PATCH /bills/:id

Atualiza uma conta a pagar.

- **Headers**: `Authorization: Bearer {token}`
- **Corpo da requisição**: Campos a serem atualizados
- **Resposta**: Dados atualizados da conta

#### PATCH /bills/:id/pay

Marca uma conta como paga.

- **Headers**: `Authorization: Bearer {token}`
- **Resposta**: Dados atualizados da conta

#### DELETE /bills/:id

Remove uma conta a pagar.

- **Headers**: `Authorization: Bearer {token}`
- **Resposta**: Mensagem de sucesso

### Metas Financeiras

#### POST /goals

Cria uma nova meta financeira.

- **Headers**: `Authorization: Bearer {token}`
- **Corpo da requisição**:
  ```json
  {
    "name": "Viagem",
    "description": "Férias na praia",
    "targetValue": 5000,
    "savedValue": 1000,
    "deadline": "2025-12-31T00:00:00Z"
  }
  ```
- **Resposta**: Dados da meta criada

#### GET /goals

Lista as metas financeiras do usuário.

- **Headers**: `Authorization: Bearer {token}`
- **Resposta**: Lista de metas

#### PATCH /goals/:id

Atualiza uma meta financeira.

- **Headers**: `Authorization: Bearer {token}`
- **Corpo da requisição**: Campos a serem atualizados
- **Resposta**: Dados atualizados da meta

#### DELETE /goals/:id

Remove uma meta financeira.

- **Headers**: `Authorization: Bearer {token}`
- **Resposta**: Mensagem de sucesso

### Dashboard

#### GET /dashboard

Retorna informações do painel financeiro do usuário.

- **Headers**: `Authorization: Bearer {token}`
- **Resposta**:
  ```json
  {
    "financialSummary": {
      "monthlyIncome": 5000,
      "monthlyExpenses": 3000,
      "investments": 1000,
      "totalBalance": 2000
    },
    "recentTransactions": [],
    "budgets": [],
    "expensesByCategory": []
  }
  ```

## Como Executar o Projeto

### Pré-requisitos

- Node.js (v18 ou superior)
- Docker e Docker Compose
- PostgreSQL

### Configuração

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Configure as variáveis de ambiente no arquivo `.env`
4. Execute as migrações: `npx prisma migrate dev`
5. Inicie o servidor: `npm run start:dev`

## Arquitetura do Projeto

O projeto segue uma arquitetura modular baseada em:

- **Módulos NestJS**: Organização por domínio de negócio
- **Repositórios**: Camada de acesso a dados
- **Casos de Uso**: Regras de negócio
- **Controladores**: Endpoints da API
- **DTOs**: Validação de dados de entrada
- **Middlewares**: Autenticação e tratamento de erros

Cada módulo é independente e segue o padrão de injeção de dependências do NestJS, facilitando a manutenção e testabilidade do código.

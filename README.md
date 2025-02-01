# Sábio Financeiro - Backend

Este repositório contém o código-fonte do **backend** do **Sábio Financeiro**, uma plataforma de gerenciamento financeiro pessoal. O backend foi desenvolvido utilizando **NestJS**, **Prisma** e **PostgreSQL**, oferecendo uma API robusta e escalável para o frontend.

---

## Tecnologias Utilizadas

- **NestJS**: Framework para construção de APIs eficientes e escaláveis.
- **Prisma**: ORM para gerenciamento do banco de dados.
- **PostgreSQL**: Banco de dados relacional para armazenamento de dados.
- **JWT**: Autenticação e autorização de usuários.
- **API REST**: Endpoints para comunicação com o frontend.
- **Docker**: Containerização do ambiente de desenvolvimento.

---

## Funcionalidades Principais

- **Autenticação de Usuários:** Registro, login e gerenciamento de sessões com JWT.
- **Gerenciamento Financeiro:** CRUD para despesas, receitas e categorias.
- **Relatórios:** Endpoints para geração de relatórios financeiros.
- **Validação de Dados:** Validação de entradas usando **class-validator** e **class-transformer**.
- **Segurança:** Criptografia de dados sensíveis e proteção contra ataques comuns.

---

## Como Executar o Projeto

### Pré-requisitos

- **Node.js** (v18 ou superior)
- **Docker** e **Docker Compose**
- **PostgreSQL** (ou outro banco de dados compatível)
- **Git**

### Passos para Configuração

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/feroddev/wallet-api
   cd wallet-api
   ```

2. **Instale as dependências**:

   ```bash
     npm install
   ```

3. **Configure as variáveis de ambiente:**

   - Crie um arquivo .env na raiz do projeto (use o .env.example como modelo).
   - Preencha as variáveis necessárias, como credenciais do banco de dados e chave secreta do JWT.

4. **Suba o banco de dados com Docker:**

   ```bash
     docker-compose up -d
   ```

5. **Execute as migrações do Prisma:**

   ```bash
     npx prisma migrate dev --name init
   ```

6. **Inicie o servidor:**

   ```bash
     npm run start:dev
   ```

7. **Acesse a API:**
   - A API estará disponível em http://localhost:3001.

## Estrutura do Projeto

```
wallet-api/
├── src/
│   ├── auth/              # Módulo de autenticação
│   ├── users/             # Módulo de usuários
│   ├── transactions/      # Módulo de transações (despesas/receitas)
│   ├── categories/        # Módulo de categorias
│   └── main.ts            # Ponto de entrada da aplicação
├── prisma/                # Schema e migrações do Prisma
├── .env.example           # Exemplo de variáveis de ambiente
├── docker-compose.yml     # Configuração do Docker
└── README.md              # Este arquivo
```

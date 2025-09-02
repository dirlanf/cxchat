# CXChat

Uma aplicação de chat em tempo real construída com NestJS (API) e React + Vite (Web).

## Pré-requisitos

- Node.js (v18+)
- Docker e Docker Compose
- Git

## Setup

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd cxchat
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

#### Arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=cxchat
POSTGRES_PORT=5432
```

#### Arquivo `.env` da API:

```bash
cp apps/api/.env.example apps/api/.env
```

Edite o arquivo `apps/api/.env`:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cxchat?schema=public
JWT_ACCESS_SECRET=dev-access-secret
JWT_ACCESS_EXPIRES=15m
CORS_ORIGIN="http://localhost:5173"
```

#### Arquivo `.env.test` da API:

```bash
cp apps/api/.env.test.example apps/api/.env.test
```

Edite o arquivo `apps/api/.env.test`:

```env
NODE_ENV=test
PORT=0
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cxchat_test?schema=public"
JWT_ACCESS_SECRET="test-secret"
JWT_ACCESS_EXPIRES="15m"
```

#### Arquivo `.env` da aplicação Web:

```bash
cp apps/web/.env.example apps/web/.env
```

Edite o arquivo `apps/web/.env`:

```env
VITE_API_URL="http://localhost:3000"
```

### 4. Suba o banco de dados

```bash
docker-compose up -d
```

### 5. Execute as migrations e gere o cliente Prisma

```bash
# => Gera o cliente Prisma
npm run db:generate

# => Executa as migrations
npm run db:migrate
```

### 6. Inicie as aplicações

#### Terminal 1 - API:

```bash
npm run dev:api
```

#### Terminal 2 - Web:

```bash
npm run dev:web
```

## Scripts

### Scripts da raiz do projeto:

- `npm run dev:web` - Inicia a aplicação web em modo desenvolvimento
- `npm run dev:api` - Inicia a API em modo desenvolvimento
- `npm run build:web` - Faz o build da aplicação web
- `npm run build:api` - Faz o build da API
- `npm run lint` - Executa o linter em todo o projeto
- `npm run typecheck` - Verifica os tipos TypeScript
- `npm run test` - Executa os testes de todos os workspaces

### Scripts do banco de dados:

- `npm run db:generate` - Gera o cliente Prisma
- `npm run db:migrate` - Executa as migrations em desenvolvimento
- `npm run db:migrate:deploy` - Executa as migrations em produção
- `npm run db:reset` - Reseta o banco de dados
- `npm run db:studio` - Abre o Prisma Studio

### Scripts específicos da API:

- `npm --workspace apps/api run start` - Inicia a API em modo produção
- `npm --workspace apps/api run start:dev` - Inicia a API em modo desenvolvimento
- `npm --workspace apps/api run test` - Executa os testes unitários
- `npm --workspace apps/api run test:e2e` - Executa os testes end-to-end
- `npm --workspace apps/api run test:cov` - Executa os testes com coverage

### Scripts específicos da Web:

- `npm --workspace apps/web run dev` - Inicia a aplicação web
- `npm --workspace apps/web run build` - Faz o build da aplicação web
- `npm --workspace apps/web run preview` - Visualiza o build da aplicação

## Testes

### Testes da API:

```bash
# => Testes unitários
npm --workspace apps/api run test

# => Testes end-to-end
npm --workspace apps/api run test:e2e

# => Testes com coverage
npm --workspace apps/api run test:cov

# => Testes em modo watch
npm --workspace apps/api run test:watch
```

### Executar todos os testes:

```bash
npm run test
```

## Padrão de Commits

Este projeto utiliza **Conventional Commits** com validação automática via Husky e Commitlint.

### Formato dos commits:

```
<tipo>[escopo opcional]: <descrição>
```

### Exemplos:

```bash
feat: add user authentication
feat(api): implement JWT token validation
```

## URLs da Aplicação

- **Web:** http://localhost:5173
- **API:** http://localhost:3000
- **API Docs (Swagger):** http://localhost:3000/api
- **Prisma Studio:** http://localhost:5555

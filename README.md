# Video Streaming App

Este projeto exibe um vídeo fornecido por uma API (incluída no projeto) via streaming, permitindo que o usuário interaja com o conteúdo por meio de anotações e indicadores.

O principal objetivo do projeto é colocar em prática os seguintes conhecimentos:

- Desenvolvimento frontend com Vue.js
- Consumo de APIs
- Streaming de vídeo
- Manipulação de elementos gráficos com a Canvas API

## Estrutura do projeto

O projeto é dividido em duas partes principais: **Web** (cliente) e **API** (servidor), organizadas dentro de um monorepo utilizando NPM Workspaces para facilitar a execução de scripts.

```sh
apps/
├── api/   # Backend (Fastify)
└── web/   # Frontend (Vue.js)
```

## Tecnologias utilizadas

### Web (frontend)

O projeto web foi desenvolvido utilizando as seguintes tecnologias:

- Vue 3
- Tailwind CSS
- TypeScript
- Vite
- Vitest

### API (backend)

O backend foi desenvolvido utilizando:seram

- NodeJs
- Fastify
- TypeScript

## Como Executar

Antes de rodar a aplicação, instale as dependências executando o seguinte comando na pasta raiz:

```sh
npm install
```

### Executando os serviços

#### Para iniciar o **Web (Frontend)**

```sh
npm run dev:web
```

#### Para iniciar a **API (Backend)**

Antes de executar a API, é necessário adicionar um vídeo no formato `.mp4` na pasta `apps/api/public` para que possa ser enviado via streaming.

```sh
npm run dev:api
```

## Gerando os arquivos para Produção

Para gerar os arquivos de build de ambos projetos, execute:

```sh
npm run build
```

Os arquivos serão salvos na pasta `/dist` de cada projeto.

## Testes automatizados

Este projeto utiliza **Vitest** e **Vue Test Utils** para a criação de testes automatizados.

Para executar os testes, execute o seguinte comando na pasta raiz:

```sh
npm run test
```

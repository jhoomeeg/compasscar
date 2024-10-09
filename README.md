
# CompassCar

CompassCar é um sistema de locação de carros desenvolvido com Node.js e MySQL, utilizando Sequelize como ORM. O sistema permite gerenciar carros e itens associados a eles, oferecendo operações CRUD (Create, Read, Update, Delete) com validações e tratamento de erros. Além disso, conta com paginação, filtros e um modelo de arquitetura limpo e modular.

## Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Requisitos](#requisitos)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Endpoints da API](#endpoints-da-api)
- [Validações e Tratamento de Erros](#validações-e-tratamento-de-erros)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)



## Sobre o Projeto

O CompassCar é um sistema de gerenciamento de carros para locadoras, que permite o cadastro, listagem, atualização e remoção de carros. Cada carro pode ter itens associados, como recursos ou características, e esses itens também podem ser gerenciados dentro do sistema.

### Objetivos

- Fornecer uma API completa para gerenciar carros e seus itens associados.
- Implementar operações CRUD para carros com validações personalizadas, como ano de fabricação e duplicidade.
- Incluir paginação e filtros para facilitar a listagem de carros.
- Proporcionar um ambiente seguro e bem documentado para futuros desenvolvimentos.

## Funcionalidades

1. **CRUD de Carros**: Permite criar, listar, atualizar e deletar carros.
2. **Associação de Itens**: Cada carro pode ter múltiplos itens associados a ele, como acessórios ou características.
3. **Paginação e Filtros**: Filtros por marca, modelo e ano, e paginação customizável.
4. **Validações**: O sistema realiza diversas validações de dados, como a verificação de ano válido para cadastro e atualização de carros.
5. **Tratamento de Erros**: Retorna mensagens de erro apropriadas para cada caso de falha na operação.

## Requisitos

Para rodar o projeto localmente, você precisará ter as seguintes ferramentas instaladas:

- [Node.js](https://nodejs.org/en/) (v14 ou superior)
- [MySQL](https://www.mysql.com/)
- [Sequelize](https://sequelize.org/)
- [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/) (opcional, para testar as APIs)

Além disso, as seguintes dependências são usadas no projeto:

- Express.js
- Sequelize (e Sequelize CLI)
- MySQL2
- Dotenv (para variáveis de ambiente)

## Configuração do Ambiente

### Passo 1: Clone o Repositório

```bash
git clone https://github.com/usuario/compasscar.git
cd compasscar
```

### Passo 2: Instale as Dependências

```bash
npm install
```

### Passo 3: Configure o Banco de Dados

Crie um arquivo `.env` na raiz do projeto e adicione as variáveis de ambiente necessárias para a conexão com o banco de dados MySQL:

```env
DB_NAME=compasscar
DB_USER=root
DB_PASSWORD=moreira22
DB_HOST=localhost
DB_PORT=3306
```

### Passo 4: Execute as Migrações(OPCIONAL)

Antes de rodar o servidor, é necessário aplicar as migrações para criar as tabelas no banco de dados:

```bash
npx sequelize db:migrate
```

### Passo 5: Execute o Servidor

```bash
npm start
```

O servidor estará rodando em `http://localhost:3000`.

## Estrutura do Projeto

```bash
compasscar/
├── config/              # Configurações do Sequelize
├── controllers/         # Controladores que gerenciam a lógica da API
├── models/              # Definição de modelos e associações Sequelize
├── routes/              # Definição das rotas da API
├── .env                 # Variáveis de ambiente (não incluído no repositório)
├── server.js            # Arquivo principal da aplicação
├── package.json         # Dependências e scripts
└── README.md            # Documentação do projeto
```

## Endpoints da API

### Carros

#### 1. Criar Carro

```http
POST api/v1/cars
```

- **Descrição**: Cadastra um novo carro no sistema.
- **Parâmetros**:
  - `brand` (string): Marca do carro.
  - `model` (string): Modelo do carro.
  - `year` (number): Ano de fabricação do carro.
  - `items` (array): Lista de itens associados ao carro (ex: "Ar condicionado", "GPS").
- **Resposta de Sucesso**: `201 Created`
  
#### 2. Listar Carros

```http
GET api/v1/cars
```

- **Descrição**: Lista carros com paginação e filtros.
- **Parâmetros de Query**:
  - `page` (number): Número da página.
  - `limit` (number): Quantidade de carros por página.
  - `brand` (string, opcional): Filtro por marca.
  - `model` (string, opcional): Filtro por modelo.
  - `year` (number, opcional): Filtro por ano.
- **Resposta de Sucesso**: `200 OK`

#### 3. Buscar Carro por ID

```http
GET api/v1/cars/:id
```

- **Descrição**: Retorna as informações de um carro específico pelo seu ID.
- **Parâmetros**: `id` (number) — ID do carro.
- **Resposta de Sucesso**: `200 OK`

#### 4. Atualizar Carro

```http
PUT api/v1/cars/:id
```

- **Descrição**: Atualiza as informações de um carro específico.
- **Parâmetros**:
  - `brand` (string, opcional)
  - `model` (string, opcional)
  - `year` (number, opcional)
  - `items` (array, opcional)
- **Resposta de Sucesso**: `204 No Content`

#### 5. Deletar Carro

```http
DELETE api/v1/cars/:id
```

- **Descrição**: Remove um carro e seus itens associados.
- **Parâmetros**: `id` (number) — ID do carro.
- **Resposta de Sucesso**: `204 No Content`

## Validações e Tratamento de Erros

- **Validação de Ano**: O ano de fabricação do carro deve estar entre 2015 e 2025.
- **Campos Obrigatórios**: Marca, modelo, ano e itens são obrigatórios no cadastro de carros.
- **Erros de Conflito**: Se um carro com os mesmos dados já estiver cadastrado, o sistema retornará um erro 409 (Conflito).
- **Paginação**: O limite de carros por página deve estar entre 1 e 10.

## Tecnologias Utilizadas

- **Node.js**: Plataforma JavaScript utilizada no back-end.
- **Express.js**: Framework para construção de APIs em Node.js.
- **MySQL**: Banco de dados relacional utilizado no projeto.
- **Sequelize**: ORM para Node.js que facilita a manipulação do banco de dados.
- **Dotenv**: Para gerenciamento de variáveis de ambiente.
- **Postman**: Ferramenta para testes de API.


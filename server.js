// Importa as dependências necessárias
const express = require("express"); // Framework web para construir APIs
const sequelize = require("./config/database"); // Configuração da conexão com o banco de dados
const carRoutes = require("./routes/carRoutes"); // Importa as rotas para o gerenciamento de carros
require("dotenv").config(); // Carrega as variáveis de ambiente do arquivo .env

// Cria uma instância do aplicativo Express
const app = express();

// Middleware para parsear requisições com payload em formato JSON
app.use(express.json());

// Configuração das rotas da aplicação
app.use(carRoutes); // Define as rotas do aplicativo, associando-as aos controladores adequados

// Define a porta do servidor a partir das variáveis de ambiente ou usa a porta padrão 3000
const PORT = process.env.PORT || 3000;

// Inicia o servidor e escuta na porta especificada
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // Log para indicar que o servidor está ativo
});

// CONEXÃO COM O BANCO DE DADOS
sequelize
  .authenticate() // Método para autenticar a conexão com o banco de dados
  .then(() => {
    console.log("Conexão com o banco de dados foi bem-sucedida."); // Log para confirmação de conexão bem-sucedida
  })
  .catch((err) => {
    console.error("Não foi possível conectar ao banco de dados:", err); // Log de erro caso a conexão falhe
  });

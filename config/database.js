// Importação do módulo 'Sequelize' da biblioteca 'sequelize', que é utilizada para interagir com o banco de dados.
const { Sequelize } = require("sequelize");

// Carregamento das variáveis de ambiente a partir do arquivo '.env'.
// Isso garante que informações sensíveis, como credenciais de acesso ao banco de dados, não fiquem expostas diretamente no código-fonte.
require("dotenv").config();

// Instanciação de uma nova conexão Sequelize com o banco de dados.
// A conexão utiliza as credenciais e configurações definidas no arquivo '.env', como o nome do banco de dados, o usuário e a senha.
const sequelize = new Sequelize(
  process.env.DB_NAME, // Nome do banco de dados, obtido das variáveis de ambiente
  process.env.DB_USER, // Usuário do banco de dados, também carregado das variáveis de ambiente
  process.env.DB_PASSWORD, // Senha do banco de dados, mantida de forma segura no arquivo '.env'
  {
    host: process.env.DB_HOST, // Host onde o banco de dados está sendo executado (ex: localhost ou endereço remoto)
    dialect: "mysql", // Dialeto do banco de dados (neste caso, MySQL)
    port: process.env.DB_PORT, // Porta na qual o banco de dados está ouvindo (padrão 3306 para MySQL), definida no arquivo '.env'
  }
);

// Exportação da instância Sequelize para que ela possa ser utilizada em outros módulos do projeto.
// Isso permite que o restante da aplicação interaja com o banco de dados por meio desta conexão.
module.exports = sequelize;

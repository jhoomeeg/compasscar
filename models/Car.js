// Importa 'DataTypes' do Sequelize. 'DataTypes' define os tipos de dados para os campos do modelo.
const { DataTypes } = require("sequelize");

// Importa a instância 'sequelize' criada no arquivo de configuração da conexão com o banco de dados.
// Isso permite que o modelo 'Car' seja associado a essa conexão.
const sequelize = require("../config/database");

// Define um modelo chamado 'Car' no Sequelize. Esse modelo mapeia para a tabela 'Cars' no banco de dados.
const Car = sequelize.define("Car", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  // Marca do carro.
  // 'allowNull: false' significa que esse campo é obrigatório (não pode ser nulo).
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Modelo do carro.
  // Semelhante ao campo 'brand', é do tipo texto e obrigatório.
  model: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Ano de fabricação do carro.
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    //  Validação personalizada para garantir que o ano seja válido.
    validate: {
      // Valida se o ano está entre um intervalo aceitável, por exemplo, entre 2015 e 2025.
      isYearValid(value) {
        const currentYear = new Date().getFullYear();
        if (value < currentYear - 10 || value > currentYear + 1) {
          // Se o valor não estiver no intervalo, lança um erro.
          throw new Error("Year should be between 2015 and 2025");
        }
      },
    },
  },
});

// Exporta o modelo 'Car' para ser usado em outros arquivos do projeto interagin com a tabela 'Cars' através do código.
module.exports = Car;

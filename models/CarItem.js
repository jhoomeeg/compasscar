// Importando 'DataTypes' do Sequelize, que é usado para definir tipos de dados dos campos no modelo.
const { DataTypes } = require("sequelize");

// Importando a instância de conexão 'sequelize' para associar o modelo ao banco de dados.
const sequelize = require("../config/database");

// Importa o modelo 'Car', pois será usado para criar a relação com 'CarItem'.
const Car = require("./Car");

// Define o modelo 'CarItem', que representará um item relacionado a um carro.
// Cada 'CarItem' corresponde a uma linha na tabela 'CarItems' no banco de dados.
const CarItem = sequelize.define("CarItem", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    // 'autoIncrement' significa que o valor será incrementado automaticamente para cada novo registro.
    autoIncrement: true,
  },

  // Campo 'name': Representa o nome do item (ex.: "Pneu", "Rádio", etc.).
  // 'allowNull: false' significa que esse campo é obrigatório.
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Campo 'car_id': Este campo faz referência ao 'id' de um carro na tabela 'Cars'.
  // Ele estabelece uma relação de chave estrangeira com o modelo 'Car'.
  car_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Car, // Faz referência ao modelo 'Car'.
      key: "id", // Chave estrangeira aponta para o campo 'id' da tabela 'Cars'.
    },
  },
});

// Estabelece uma relação "um para muitos" entre 'Car' e 'CarItem'.
// Um carro pode ter vários itens associados.
Car.hasMany(CarItem, { foreignKey: "car_id", as: "items" });

// Estabelece a relação inversa, "muitos para um", indicando que cada 'CarItem' pertence a um 'Car'.
// Isso é feito por meio da chave estrangeira 'car_id' que aponta para um carro específico.
CarItem.belongsTo(Car, { foreignKey: "car_id" });

// Exporta o modelo 'CarItem' para que possa ser utilizado em outras partes do projeto.
module.exports = CarItem;

const Car = require("../models/Car");
const carItem = require("../models/CarItem");
const { Op } = require("sequelize");

// Função para cadastrar novos carros no sistema
exports.createCar = async (req, res) => {
  // Desestruturação das informações do carro recebidas no corpo da requisição
  const { brand, model, year, items } = req.body;

  // Validação para garantir que todos os campos obrigatórios estejam preenchidos
  if (!brand || !model || !year || !items || !items.length) {
    // Retorna um erro de requisição inválida caso algum campo esteja ausente
    return res.status(400).json({ error: "All fields are required" });
  }

  // Validação do ano do carro para assegurar que está dentro do intervalo permitido (2015-2025)
  const currentYear = new Date().getFullYear();
  if (year < currentYear - 10 || year > currentYear + 1) {
    return res
      .status(400)
      .json({ error: "Year should be between 2015 and 2025" });
  }

  // Verificação de duplicidade para evitar a criação de carros com os mesmos dados
  const existingCar = await Car.findOne({ where: { brand, model, year } });
  if (existingCar) {
    // Retorna um erro de conflito caso um carro igual já exista no banco de dados
    return res
      .status(409)
      .json({ error: "there is already a car with this data" });
  }

  // Criação do novo registro de carro no banco de dados
  const car = await Car.create({ brand, model, year });

  // Remoção de duplicatas na lista de itens antes de realizar a associação
  const uniqueItems = [...new Set(items)];

  // Associa cada item único ao carro criado através de iterações
  for (let item of uniqueItems) {
    // Criação de cada item e associação ao carro utilizando o ID gerado
    await CarItem.create({ name: item, car_id: car.id });
  }

  // Resposta de sucesso ao cliente com o ID do carro recém-criado
  res.status(201).json({ message: "Car created successfully", id: car.id });
};

// Função para listar todos os carros cadastrados no sistema
exports.listCars = async (req, res) => {
  const { page = 1, limit = 5, brand, model, year } = req.query;

  // Validação para assegurar que o limite de resultados esteja entre 1 e 10
  const validatedLimit = Math.min(Math.max(parseInt(limit), 1), 10);

  // Configuração das opções de consulta para buscar carros
  const options = {
    where: {},
    include: [
      {
        model: carItem,
        as: "items", // Certifique-se de que este alias corresponda à definição da associação
      },
    ],
    limit: validatedLimit,
    offset: (page - 1) * validatedLimit,
  };

  // Aplicação de filtros opcionais baseados nos parâmetros de consulta
  if (brand) {
    options.where.brand = { [Op.iLike]: `%${brand}%` }; // Filtro de marca
  }
  if (model) {
    options.where.model = { [Op.iLike]: `%${model}%` }; // Filtro de modelo
  }
  if (year) {
    options.where.year = { [Op.gte]: year }; // Filtro de ano
  }

  try {
    // Busca os carros no banco de dados, contando o número total de registros
    const { count, rows } = await Car.findAndCountAll(options);
    const pages = Math.ceil(count / validatedLimit);

    if (count === 0) {
      // Retorna status 204 (sem conteúdo) caso nenhum carro seja encontrado
      return res.status(204).send();
    }

    // Retorna a resposta com os dados dos carros e informações de paginação
    return res.status(200).json({
      count,
      pages,
      data: rows,
    });
  } catch (error) {
    console.error(error); // Log do erro para análise futura
    // Retorna status 500 em caso de erro interno do servidor
    return res.status(500).json({ error: "internal server error" });
  }
};

// Função para buscar detalhes de um carro específico pelo ID
exports.getCarById = async (req, res) => {
  const { id } = req.params; // Obtém o ID do carro a partir dos parâmetros da requisição

  try {
    // Busca o carro no banco de dados utilizando o ID informado
    const car = await Car.findOne({
      where: { id },
      include: [
        {
          model: carItem, // Inclui os itens associados ao carro na busca
          as: "items", // Assegura que o alias utilizado está correto
        },
      ],
    });

    if (!car) {
      // Retorna status 404 caso o carro não seja encontrado
      return res.status(404).json({ error: "car not found" });
    }

    // Retorna os detalhes do carro encontrado com status 200
    return res.status(200).json(car);
  } catch (error) {
    // Retorna status 500 em caso de erro interno do servidor
    return res.status(500).json({ error: "internal server error" });
  }
};

// Função para atualizar os dados de um carro existente
exports.updateCar = async (req, res) => {
  const { id } = req.params; // Obtém o ID do carro a partir dos parâmetros da requisição
  const { brand, model, year, items } = req.body; // Desestrutura as informações do corpo da requisição

  try {
    // Busca o carro no banco de dados utilizando o ID informado
    const car = await Car.findOne({ where: { id } });

    if (!car) {
      // Retorna status 404 caso o carro não seja encontrado
      return res.status(404).json({ error: "car not found" });
    }

    // Validação do ano do carro antes da atualização
    const currentYear = new Date().getFullYear();
    if (year && (year < currentYear - 10 || year > currentYear + 1)) {
      return res
        .status(400)
        .json({ error: "Year should be between 2015 and 2025" });
    }

    // Verificação de duplicidade para evitar a atualização com dados já existentes
    if (brand && model && year) {
      const existingCar = await Car.findOne({
        where: { brand, model, year },
      });

      if (existingCar && existingCar.id !== parseInt(id, 10)) {
        return res
          .status(409)
          .json({ error: "there is already a car with this data" });
      }
    }

    // Atualiza os campos do carro somente se forem fornecidos na requisição
    if (brand) car.brand = brand;
    if (model) car.model = model;
    if (year) car.year = year;

    // Se novos itens forem enviados, atualiza a lista de itens do carro
    if (items) {
      // Remoção de duplicatas na lista de itens
      const uniqueItems = [...new Set(items)];

      // Limpeza dos itens antigos associados ao carro
      await carItem.destroy({ where: { car_id: car.id } });

      // Adiciona os novos itens ao carro
      for (let item of uniqueItems) {
        await carItem.create({ name: item, car_id: car.id });
      }
    }

    // Salva as alterações realizadas no carro
    await car.save();

    // Retorna status 204 (sem conteúdo) indicando que a atualização foi bem-sucedida
    return res.status(204).send().json({ message: "Car updated successfully" });
  } catch (error) {
    console.error(error); // Log do erro para análise futura
    // Retorna status 500 em caso de erro interno do servidor
    return res.status(500).json({ error: "internal server error" });
  }
};

// Função para deletar um carro do sistema
exports.deleteCar = async (req, res) => {
  const { id } = req.params; // Obtém o ID do carro a partir dos parâmetros da requisição

  try {
    // Busca o carro no banco de dados utilizando o ID informado
    const car = await Car.findOne({
      where: { id },
      include: [
        {
          model: carItem,
          as: "items",
        },
      ],
    });

    if (!car) {
      // Retorna status 404 caso o carro não seja encontrado
      return res.status(404).json({ error: "car not found" });
    }

    // Exclui todos os itens associados ao carro antes de deletá-lo
    await carItem.destroy({ where: { car_id: car.id } });

    // Deleta o carro do banco de dados
    await Car.destroy({ where: { id } });

    // Retorna status 204 (sem conteúdo) indicando que a exclusão foi bem-sucedida
    return res.status(204).send().json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error(error); // Log do erro para análise futura
    // Retorna status 500 em caso de erro interno do servidor
    return res.status(500).json({ error: "internal server error" });
  }
};

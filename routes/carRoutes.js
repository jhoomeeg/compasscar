// Importa o módulo express para criar rotas e gerenciar a aplicação
const express = require("express");
// Importa o controlador de carros que contém a lógica de negócio
const carController = require("../controllers/carControllers");
// Cria uma instância do roteador Express para definir as rotas
const router = express.Router();

// Rota para criar um novo carro no sistema
router.post("/api/v1/cars", carController.createCar);

// Rota para listar todos os carros cadastrados no sistema
router.get("/api/v1/cars", carController.listCars);

// Rota para obter detalhes de um carro específico pelo ID
router.get("/api/v1/cars/:id", carController.getCarById);

// Rota para atualizar os dados de um carro existente pelo ID
router.patch("/api/v1/cars/:id", carController.updateCar);

// Rota para deletar um carro do sistema pelo ID
router.delete("/api/v1/cars/:id", carController.deleteCar);

// Exporta o roteador para ser utilizado na aplicação principal
module.exports = router;

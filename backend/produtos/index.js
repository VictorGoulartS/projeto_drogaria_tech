//config inicial
const Produto = require("./model/produto");
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
require("dotenv").config();
const app = express();

app.use(express.json());

const {
  PRODUTODB_USERNAME,
  PRODUTODB_PASSWORD,
  PRODUTODB_CLUSTER,
  PRODUTODB_HOST,
  PRODUTODB_DATABASE,
} = process.env;
const urlProdutoDB = `mongodb+srv://${PRODUTODB_USERNAME}:${PRODUTODB_PASSWORD}@${PRODUTODB_CLUSTER}.${PRODUTODB_HOST}.mongodb.net/${PRODUTODB_DATABASE}`;

mongoose
  .connect(urlProdutoDB)
  .then(() => console.log("Conectamos ao MongoDB!"))
  .catch((err) => console.log(err));

app.get("/produtos", async (req, res) => {
  try {
    const prod = await Produto.find();

    res.status(200).json(prod);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.get("/produtos/:id", async (req, res) => {
  //extrair o dado da requisição, pela url = req.params
  const id = req.params.id;

  try {
    const produto = await Produto.findOne({ _id: id });

    if (!produto) {
      res.status(422).json({ message: "Produto não encontrado!" });
      return;
    }

    res.status(200).json(produto);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

// rotas da API

app.post("/produtos", async (req, res) => {
  //req.body
  const { nome, imagem, descricao, beneficio } = req.body;

  const produto = {
    nome,
    imagem,
    descricao,
    beneficio,
  };

  try {
    //criando dados
    await Produto.create(produto);
    console.log(produto);
  } catch (error) {
    console.log(error);
  }

  await axios
    .post("http://localhost:10000/eventos", {
      tipo: "ProdutoCriado",
      dados: { produto },
    })
    .catch((err) => console.log({ erro: err }));
  res.status(201).send({ produto });
});

app.put("/produtos/:id", async (req, res) => {
  const id = req.params.id;

  const { nome, imagem, descricao, beneficio } = req.body;

  const produto = {
    nome,
    imagem,
    descricao,
    beneficio,
  };

  try {
    const updatedProduto = await Produto.updateOne({ _id: id }, produto);

    if (updatedProduto.matchedCount === 0) {
      res.status(422).json({ message: "Produto não encontrado!" });
      return;
    }

    res.status(200).json(produto);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

app.delete("/produtos/:id", async (req, res) => {
  const id = req.params.id;

  const produto = await Produto.findOne({ _id: id });

  if (!produto) {
    res.status(422).json({ message: "Produto não encontrado!" });
    return;
  }

  try {
    await Produto.deleteOne({ _id: id });

    res.status(200).json({ message: "Produto removido com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

app.post("/eventos", (req, res) => {
  console.log(req.body);
  res.status(200).send({ msg: "ok" });
});

app.listen(3001, () => console.log("Produtos. Porta 3001."));

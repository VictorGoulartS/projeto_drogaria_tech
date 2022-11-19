//config inicial
const Loja = require("./model/loja");
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
require("dotenv").config();
const app = express();

app.use(express.json());

const {
  LOJADB_USERNAME,
  LOJADB_PASSWORD,
  LOJADB_CLUSTER,
  LOJADB_HOST,
  LOJADB_DATABASE,
} = process.env;
const urlLojaDB = `mongodb+srv://${LOJADB_USERNAME}:${LOJADB_PASSWORD}@${LOJADB_CLUSTER}.${LOJADB_HOST}.mongodb.net/${LOJADB_DATABASE}?retryWrites=true&w=majority`;

mongoose
  .connect(urlLojaDB)
  .then(() => console.log("Conectamos ao MongoDB!"))
  .catch((err) => console.log(err));

// rotas da API

// rota inicial / endpoint
app.get("/lojas", async (req, res) => {
  try {
    const loj = await Loja.find();

    res.status(200).json(loj);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.get("/lojas/:id", async (req, res) => {
  //extrair o dado da requisição, pela url = req.params
  const id = req.params.id;

  try {
    const loja = await Loja.findOne({ _id: id });

    if (!loja) {
      res.status(422).json({ message: "Loja não encontrada!" });
      return;
    }

    res.status(200).json(loja);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

app.post("/lojas", async (req, res) => {
  const { nome, endereco, telefone } = req.body;
  const loja = {
    nome,
    endereco,
    telefone,
  };

  try {
    //criando dados
    await Loja.create(loja);
    console.log(loja);
  } catch (error) {
    console.log(error);
  }

  await axios
    .post("http://localhost:10000/eventos", {
      tipo: "LojaCriada",
      dados: { loja },
    })
    .catch((err) => console.log({ erro: err }));
  res.status(201).send({ loja });
});

app.put("/lojas/:id", async (req, res) => {
  const id = req.params.id;

  const { nome, endereco, telefone } = req.body;

  const loja = {
    nome,
    endereco,
    telefone,
  };

  try {
    const updatedLoja = await Loja.updateOne({ _id: id }, loja);

    if (updatedLoja.matchedCount === 0) {
      res.status(422).json({ message: "Loja não encontrada!" });
      return;
    }

    res.status(200).json(loja);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

app.delete("/lojas/:id", async (req, res) => {
  const id = req.params.id;

  const loja = await Loja.findOne({ _id: id });

  if (!loja) {
    res.status(422).json({ message: "Loja não encontrada!" });
    return;
  }

  try {
    await Loja.deleteOne({ _id: id });

    res.status(200).json({ message: "Loja removida com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

app.post("/eventos", (req, res) => {
  console.log(req.body);
  res.status(200).send({ msg: "ok" });
});

app.listen(4000, () => console.log("Lojas. Porta 4000."));

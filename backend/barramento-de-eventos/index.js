const express = require("express");
//para enviar eventos para os demais microsserviços
const axios = require("axios");

const app = express();
app.use(express.json());

const eventos = [];

app.get("/eventos", (req, res) => {
  res.send(eventos);
});

app.post("/eventos", (req, res) => {
  const evento = req.body;
  eventos.push(evento);
  //envia o evento para o microsserviço de lojas
  axios.post("http://localhost:4000/eventos", evento).catch((err) => {
    console.log("Microsserviço de lojas fora do ar.");
  });
  //envia o evento para o microsserviço de produtos
  axios.post("http://localhost:3001/eventos", evento).catch((err) => {
    console.log("Microsserviço de produtos fora do ar.");
  });

  res.status(200).send({ msg: "ok" });
});

app.listen(10000, () => {
  try {
    console.log("Barramento de Eventos. Porta 10000");
  } catch (err) {
    console.log("Barramento de Eventos  fora de ar");
  }
});

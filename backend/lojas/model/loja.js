const mongoose = require("mongoose");

const Loja = mongoose.model("Loja", {
  nome: String,
  endereco: String,
  telefone: Number,
});

module.exports = Loja;

const mongoose = require("mongoose");

const Produto = mongoose.model("Produto", {
  nome: String,
  imagem: String,
  descricao: String,
  beneficio: String,
});

module.exports = Produto;

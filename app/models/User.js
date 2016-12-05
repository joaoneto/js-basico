const uuid = require('uuid');
const mongoose = require('mongoose');

const User = new mongoose.Schema({
  _id: {
    type: String,
    default: () => uuid.v1()
  },
  nome: { type: String, trim: true },
  email: { type: String, lowercase: true, index: { unique: true } },
  salt: { type: String },
  senha: String,
  telefones: [{ numero: Number, ddd: Number }],
  data_criacao: Date,
  data_atualizacao: { type: Date, default: Date.now },
  ultimo_login: Date,
  token: String
});

module.exports = mongoose.model('User', User);

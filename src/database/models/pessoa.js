'use strict';
const valido = require ('../../utils/validaCpfHelper.js');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pessoa extends Model {
    static associate(models) {
      Pessoa.hasMany(models.Curso, {
        foreignKey: 'docente_id'
      });
      Pessoa.hasMany(models.Matricula, {
        foreignKey: 'estudante_id',
        scope: { status: 'matriculado' },
        as: 'aulasMatriculadas'
      });
      Pessoa.hasMany(models.Matricula, {
        foreignKey: 'estudante_id',
        as: 'todasAsMatriculas'
      });
    }
  }
  Pessoa.init({
    nome: {type: DataTypes.STRING, validate: {len: {args: [3, 30], msg: 'campo nome deve ter entre 3 e 30 caracteres'}}},
    email: {type: DataTypes.STRING, validate: {isEmail: {args: true, msg: 'formato do email inválido'}}},
    cpf: {type: DataTypes.STRING, validate: {cpfValido: (cpf) => {
      if(!valido(cpf)) throw new Error('numero do cpf inválido')
    }}},
    ativo: DataTypes.BOOLEAN,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Pessoa',
    tableName: 'pessoas',
    paranoid: true,
    defaultScope: {where: {ativo: true }}, scopes: {todosOsRegistros: {where: {}}}
  });
  return Pessoa;
};
const ModelBase = require('../ModelBase');
const User = require('./User');
// const { debug } = require('../utils/logger')('api:model:genre');

class Genre extends ModelBase {
  static get tableName() { return 'genres'; }

  static get modelName() { return 'Genre'; }

  static get tableKeys() {
    return {
      id          : {},
      user        : { required: true, relation: { Model: User, allowId: true }, default: this.userId },
      name        : { required: true, unique: true },
      status      : { default: 'private' },
      images      : [],
      updatedAt   : []
    };
  }

  static get modelData() {
    const { tableName, modelName, tableKeys } = Genre;
    return { tableName, modelName, tableKeys };
  }

  constructor(genreData, parent) {
    super(Genre.modelData, genreData, parent);
  }
}

module.exports = Genre;

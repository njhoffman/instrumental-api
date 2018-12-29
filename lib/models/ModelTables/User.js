const bcrypt = require('bcrypt');
const ModelBase = require('../ModelBase');
const getModels = require('../all');
// const { info } = require('../utils/logger')('api:model:user');

class User extends ModelBase {
  static get tableName() { return 'users'; }

  static get modelName() { return 'User'; }

  static get tableKeys() {
    const { Field, Song } = getModels();
    /* eslint-disable max-len */
    return {
      id:                   {},
      firstName:            {},
      lastName:             {},
      email:                { required: true, validate: ['email'] },
      password:             { validate: ['password'], hidden: true },
      picture:              { validate: ['url'] },
      maxDifficulty:        { validate: ['number'], default: 10 },
      maxProgress:          { validate: ['number'], default: 4 },
      songBrushUpInterval:  { validate: ['number'], default: 60 },
      songBrushUpDuration:  { validate: ['number'], default: 7 },
      songBrushUpEmail:     { validate: ['bool'], default: true },
      songGoalEmail:        { validate: ['bool'], default: true },
      visualTheme:          { default: 'steelBlue.dark' },
      normalizePoints:      { default: false },
      notificationsEmail:   { validate: ['email'] },
      userFields:           { relation: { type: 'oneToMany', reverse: true, field: 'user', table: 'fields', Model: Field } },
      songs:                { relation: { type: 'oneToMany', reverse: true, field: 'user', table: 'songs', Model: Song } },
      roles:                [], // TODO: validate oneOf('default', 'user', 'admin') -> load from config
      updatedAt:            [], // TODO: validate timestamp
    };
    /* eslint-enable max-len */
  }

  static get modelData() {
    const { tableName, modelName, tableKeys } = User;
    return { tableName, modelName, tableKeys };
  }

  static generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  }

  constructor(userData, existing) {
    super(User.modelData, userData, existing);
  }

  validPassword(password) {
    if (global.__SKIP_AUTH__) {
      return true;
    }
    return password && this.fields.password ? bcrypt.compareSync(password, this.fields.password) : false;
  }
}

module.exports = User;
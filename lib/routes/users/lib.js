const { map, filter, find, omit } = require('lodash');
const { initLogger } = require('lib/utils/logger');

const parseUserFields = (seedCf, userFields) => {
  const { warn } = initLogger('routes:users:lib');
  // hook up ref and refId connections between the user fields and song seed data
  const match = find(userFields.userFields, { refId: seedCf.ref });
  if (!match) {
    warn(`There was no user field match for seed data reference: ${seedCf.ref}`);
    return seedCf;
  }
  return ({ ...seedCf, id: match.id });
};

const seedNewUser = (email, num, { User, Song, Field }) => {
  const { warn, info } = initLogger('routes:users:lib');
  let user;
  return User.modelByField({ email })
    .then(foundUser => {
      if (!foundUser) {
        warn(`Authenticated user ${email} not found for seeding.`);
        return false;
      }
      user = foundUser;
      const { fields: { id: userId } } = foundUser;
      const seedData = Field.getSeedData();
      const fieldData = map(filter(seedData, 'refId'), (sd) => ({
        ...omit(sd, 'id'),
        user: userId
      }));
      info(`Seeding ${email} with ${fieldData.length} user associated user field records`);
      return Field.seed(0, fieldData);
    })
    .then(() => (user.deep()))
    .then((userFields) => {
      const seedData = Song.getSeedData();
      info(`Seeding ${email} with ${num > 0 ? num : seedData.length} records`);
      const songData = map(seedData, sd => ({
        ...sd,
        user: userFields.id,
        userFields: sd.userFields.map(seedUserField => parseUserFields(seedUserField, userFields))
      }));
      return Song.seed(0, songData);
    })
    .then((results) => ({ records: user.fields, ...results }));
};

module.exports = {
  seedNewUser
};

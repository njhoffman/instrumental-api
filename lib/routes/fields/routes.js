const router = require('express').Router();
const Field = require('../../models/Field');

const { debug } = require('debugger-256')('api:fields');

export default function (passport) {
  const updateField = (req, res) => {
    const { user: { id }, body } = req;
    const fieldData = { ...body, ...{ user: id } };
    Field.save(fieldData)
      .then(savedField => {
        debug('Updated Field: %O', savedField);
        return res.json({
          status: 200,
          data: savedField
        });
      });
  }

  const addField = (req, res, next) => {
    const { user: { id }, body } = req;
    const fieldData = { ...body, ...{ user: id } };
    return Field.save(fieldData)
      .then(results => {
        debug('Added Field: %O', fieldData)
        return res.json({ status: 200, data: results });
      });
  }

  const deleteField = (req, res) => {
    const { user: { id }, body } = req;
    const fieldData = { ...{ id: body.id}, ...{ user: id } };
    const bodyId = req.body.id !== undefined ? req.body.id : false;
    if (!bodyId) {
      return res.json({ status: 400, data: { error: 'No id in request body' } });
    }
    Field.delete(fieldData)
      .then(results => {
        return res.json({ status: 200, data: results });
      })
  };

  router.post('/add',    passport.authenticate('jwt', { session: false }), addField);
  router.post('/update', passport.authenticate('jwt', { session: false }), updateField);
  router.post('/delete', passport.authenticate('jwt', { session: false }), deleteField);

  return router;
}